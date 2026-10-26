import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DbTransaction,
  InventoryDatabaseService,
} from '../databaseService/inventoryDatabase.service';
import { LowStockService } from '../lowStockEvent/lowStockEvent.service';
import {
  AdjustStockDto,
  AdjustStockResult,
  PartStockRowArraySchema,
  RecordStockMovementInput,
  StockMovementDataRowArraySchema,
} from './schema/stockMovements.schema';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly db: InventoryDatabaseService,
    private readonly lowStockService: LowStockService,
  ) {}

  /////////////////////////////////////////////////////////
  //
  //  GetStockDataById()
  //  Get the stock history (movements) for one part, by the part's ID
  //
  /////////////////////////////////////////////////////////
  async getStockDataById(partId: number) {
    const sql = `
    SELECT
      sm.id,
      sm.delta,
      sm.stockLevelAfter,
      sm.createdAt,
      sm.reason,
      u.username AS userName
    FROM stockMovements sm
    LEFT JOIN users u ON sm.userId = u.id
    WHERE sm.partId = ?
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql, [partId]);

    //Validate with ZOD schema
    const validatedData = StockMovementDataRowArraySchema.parse(rows);

    return { data: validatedData };
  }

  /////////////////////////////////////////////////////////
  //
  //  Record()
  //  Write one row to the stock history. Takes the open transaction, so the
  //  movement is saved (or rolled back) together with the stock change that
  //  caused it. Used by adjustStock() below and by PartService.createPart()
  //  for a new part's starting stock.
  //
  /////////////////////////////////////////////////////////
  async record(
    tx: DbTransaction,
    input: RecordStockMovementInput,
  ): Promise<void> {
    await tx.run(
      `INSERT INTO stockMovements (partId, delta, stockLevelAfter, reason, userId)
       VALUES (?, ?, ?, ?, ?)`,
      [
        input.partId,
        input.delta,
        input.stockLevelAfter,
        input.reason,
        input.userId,
      ],
    );
  }

  /////////////////////////////////////////////////////////
  //
  //  AdjustStock()
  //  Add or remove stock (delta > 0 adds, delta < 0 removes), log it in
  //  stockMovements, and create or update the low stock event if the part is
  //  now below its minimum.
  //  Everything happens in one transaction, so it all succeeds or none of it does.
  //
  /////////////////////////////////////////////////////////
  async adjustStock(
    partId: number,
    userId: number | null,
    input: AdjustStockDto,
  ): Promise<AdjustStockResult> {
    return this.db.transaction(async (tx) => {
      // Lock the row so two changes at the same time can't overwrite each other
      const rows = await tx.query(
        'SELECT id, stockLevel, minStockLevel FROM parts WHERE id = ? FOR UPDATE',
        [partId],
      );
      const part = PartStockRowArraySchema.parse(rows)[0];

      if (!part) {
        throw new NotFoundException(`Part ${partId} not found`);
      }

      const newStockLevel: number = part.stockLevel + input.delta;

      if (newStockLevel < 0) {
        throw new BadRequestException('Stock level cannot go below 0');
      }

      await tx.run('UPDATE parts SET stockLevel = ? WHERE id = ?', [
        newStockLevel,
        partId,
      ]);

      await this.record(tx, {
        partId,
        delta: input.delta,
        stockLevelAfter: newStockLevel,
        reason: input.reason,
        userId,
      });

      const lowStockEventId = await this.lowStockService.syncForPart(
        tx,
        partId,
        newStockLevel,
        part.minStockLevel,
      );

      return {
        partId,
        stockLevel: newStockLevel,
        minStockLevel: part.minStockLevel,
        lowStockEventId,
      };
    });
  }
}
