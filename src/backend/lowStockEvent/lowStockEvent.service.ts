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
  RecentLowStockEventDataRowArraySchema,
} from './schema/lowStockEvent.schema';
import { TotalRowSchema } from '../common/schema/common.schema';

// Which low stock rows are removed automatically when stock comes back up: the ones
// a stock drop created (autoEntered) that aren't in the cart yet. Manual requests stay.
const CLEARABLE_EVENT_CONDITION = 'autoEntered = 1';

@Injectable()
export class LowStockService {
  constructor(private readonly db: InventoryDatabaseService) {}

  // Get all columns forlow stock parts
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
    // Rows with inCart = 1 are in the cart and hidden from the table.
    const sql = `SELECT
        lsp.id AS lowStockId,
        lsp.stockLevel,
        lsp.minStockLevel,
        lsp.quantity,
        lsp.urgency,
        lsp.requestedBy,
        lsp.inCart,
        lsp.partId,
        (lsp.partId = 0) AS isNewPart,
        COALESCE(p.name, lsp.newPartName, '') AS name,
        COALESCE(p.description, lsp.newPartDescription, '') AS description,
        COALESCE(p.comment, lsp.newPartComment) AS comment,
        COALESCE(p.averagePrice, 0) AS averagePrice,
        COALESCE(p.partURL, lsp.newPartURL) AS partURL
      FROM lowStockEvents lsp
      LEFT JOIN parts p ON p.id = lsp.partId
      WHERE lsp.inCart = 0
      ORDER BY lsp.id
      LIMIT ? OFFSET ?`;
    const countSql =
      'SELECT COUNT(*) as total FROM lowStockEvents WHERE inCart = 0';

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

  async getRecentLowStockParts() {
    const sql = `SELECT p.name, p.description, lsp.triggeredAt, COUNT(*) OVER() AS totalRows FROM lowStockEvents lsp LEFT JOIN parts p ON p.id = lsp.partId LIMIT 5`;
    const rows = await this.db.query(sql);

    //Backend ZOD validation
    const validatedRows = RecentLowStockEventDataRowArraySchema.parse(rows);

    //Return Vaidated rows
    return validatedRows;
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
  //  changes a part's stock.
  //  If the part is now below its minimum:
  //    - it already has an event: update that row's levels
  //    - it has no event: insert a new one (autoEntered = 1)
  //    Returns the event id.
  //  If the part is at or above its minimum:
  //    - delete its automatic event (autoEntered = 1), unless it is already in the
  //      cart. Manual requests (autoEntered = 0) are left alone.
  //    Returns null.
  //
  ///////////////////////////////////////////////////////////
  async syncForPart(
    tx: DbTransaction,
    partId: number,
    stockLevel: number,
    minStockLevel: number,
  ): Promise<number | null> {
    if (stockLevel >= minStockLevel) {
      //runs if stock level is above minimum, deletes the row from lowstockevents
      await tx.run(
        `DELETE FROM lowStockEvents WHERE partId = ? AND ${CLEARABLE_EVENT_CONDITION}`,
        [partId],
      );
      return null;
    }

    //runs if stock level is below minimum, updates or inserts the row in lowstockevents
    const openEventRows = await tx.query(
      `SELECT id FROM lowStockEvents
       WHERE partId = ?
       ORDER BY id DESC
       LIMIT 1`,
      [partId],
    );

    //zod schema validation
    const openEvent = OpenLowStockEventRowArraySchema.parse(openEventRows)[0];

    //if there is id, update the existing low stock event
    if (openEvent) {
      await tx.run(
        'UPDATE lowStockEvents SET stockLevel = ?, minStockLevel = ? WHERE id = ?',
        [stockLevel, minStockLevel, openEvent.id],
      );
      return openEvent.id;
    }

    //if there is no id, insert a new low stock event
    const result = await tx.run(
      'INSERT INTO lowStockEvents (partId, stockLevel, minStockLevel, autoEntered) VALUES (?, ?, ?, 1)',
      [partId, stockLevel, minStockLevel],
    );
    return result.insertId;
  }

  ///////////////////////////////////////////////////////////
  //
  //  willClearForPart()
  //  Preview of syncForPart(): would a stock change to this level remove the
  //  part's low stock event? True only when the part would be at or above its
  //  minimum and has an automatic event that isn't in the cart yet.
  //  Changes nothing. Uses the same rule as syncForPart(), so what the
  //  confirm message says matches what happens.
  //
  ///////////////////////////////////////////////////////////
  async willClearForPart(
    partId: number,
    stockLevel: number,
    minStockLevel: number,
  ): Promise<boolean> {
    if (stockLevel < minStockLevel) {
      return false;
    }

    const rows = await this.db.query(
      `SELECT id FROM lowStockEvents
       WHERE partId = ? AND ${CLEARABLE_EVENT_CONDITION}
       LIMIT 1`,
      [partId],
    );
    return rows.length > 0;
  }
}
