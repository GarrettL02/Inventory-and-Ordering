import { Injectable } from '@nestjs/common';
import {
  DbTransaction,
  InventoryDatabaseService,
} from '../databaseService/inventoryDatabase.service';
import {
  LowStockEventTableDataRowArraySchema,
  LowStockEventAllDataRowArraySchema,
  LowStockEventDataByIdRowArraySchema,
  OpenLowStockEventRowArraySchema,
} from './schema/lowStockEvent.schema';
import { TotalRowSchema } from '../common/schema/common.schema';

@Injectable()
export class LowStockService {
  constructor(private readonly db: InventoryDatabaseService) {}

  // Get all low stock parts
  async getLowStockParts() {
    const sql = `SELECT * FROM lowStockEvents`;
    const rows = await this.db.query(sql);

    //Backend ZOD validation
    const validatedRows = LowStockEventAllDataRowArraySchema.parse(rows);

    //Return Vaidated rows
    return validatedRows;
  }

  //Get all data needed for clean fetch function on table
  async getLowStockPartTableData(page: number = 1, limit: number = 15) {
    const offset = (page - 1) * limit;

    // LEFT JOIN so new-part requests (partId 0, no row in parts) still show up -
    // their details come from the newPart columns on the event itself.
    // Rows with ordered = 1 are finished and hidden from the table.
    const sql = `SELECT
        lsp.id AS lowStockId,
        lsp.stockLevel,
        lsp.minStockLevel,
        lsp.quantity,
        lsp.urgency,
        lsp.requestedBy,
        lsp.sent,
        lsp.partId,
        (lsp.partId = 0) AS isNewPart,
        COALESCE(p.name, lsp.newPartName, '') AS name,
        COALESCE(p.description, lsp.newPartDescription, '') AS description,
        COALESCE(p.comment, lsp.newPartComment) AS comment,
        COALESCE(p.averagePrice, 0) AS averagePrice,
        COALESCE(p.partURL, lsp.newPartURL) AS partURL
      FROM lowStockEvents lsp
      LEFT JOIN parts p ON p.id = lsp.partId
      WHERE lsp.ordered = 0
      ORDER BY lsp.id
      LIMIT ? OFFSET ?`;
    const countSql =
      'SELECT COUNT(*) as total FROM lowStockEvents WHERE ordered = 0';

    const rows = await this.db.query(sql, [limit, offset]);
    const countResult = await this.db.query(countSql);
    const total = TotalRowSchema.parse(countResult[0]).total;

    //Backend ZOD validation
    const validatedRows = LowStockEventTableDataRowArraySchema.parse(rows);

    return {
      data: validatedRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  //From low stock parts - Get a part by its ID
  async getLowStockPartById(id: number) {
    //Build SQL query to grab low stock part by its ID
    const sql = 'SELECT * FROM lowStockEvents WHERE id = ?';
    //Create rows to store rows that match the query
    const rows = await this.db.query(sql, [id]);
    //return the rows if possible, display null if not

    //Backend ZOD validation
    const validatedData = LowStockEventDataByIdRowArraySchema.parse(rows);

    return validatedData[0] || null;
  }

  ///////////////////////////////////////////////////////////
  //
  //  syncForPart()
  //  Replaces the old part_low_stock_trigger. Called inside the transaction that
  //  changes a part's stock. If the part is now below its minimum:
  //    - it already has an open event (ordered = 0): update that row's levels
  //    - it has no open event: insert a new one
  //  Returns the event id, or null if the part is not below its minimum.
  //
  ///////////////////////////////////////////////////////////
  async syncForPart(
    tx: DbTransaction,
    partId: number,
    stockLevel: number,
    minStockLevel: number,
  ): Promise<number | null> {
    if (stockLevel >= minStockLevel) {
      return null;
    }

    const openEventRows = await tx.query(
      `SELECT id FROM lowStockEvents
       WHERE partId = ? AND ordered = 0
       ORDER BY id DESC
       LIMIT 1`,
      [partId],
    );

    const openEvent = OpenLowStockEventRowArraySchema.parse(openEventRows)[0];

    if (openEvent) {
      await tx.run(
        'UPDATE lowStockEvents SET stockLevel = ?, minStockLevel = ? WHERE id = ?',
        [stockLevel, minStockLevel, openEvent.id],
      );
      return openEvent.id;
    }

    const result = await tx.run(
      'INSERT INTO lowStockEvents (partId, stockLevel, minStockLevel) VALUES (?, ?, ?)',
      [partId, stockLevel, minStockLevel],
    );
    return result.insertId;
  }
}
