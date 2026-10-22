import { Injectable } from '@nestjs/common';
import { PartkeeprDatabaseService } from '../partkeeprDatabase/partkeeprDatabase.service';
import {
  LowStockEventTableDataRowArraySchema,
  LowStockEventAllDataRowArraySchema,
  LowStockEventDataByIdRowArraySchema,
} from './schema/lowStockEvent.schema';

@Injectable()
export class LowStockService {
  constructor(private readonly db: PartkeeprDatabaseService) {}

  // Get all low stock parts
  async getLowStockParts() {
    const sql = `SELECT * FROM PartLowStockEvents`;
    const rows = await this.db.query(sql);

    //Backend ZOD validation
    const validatedRows = LowStockEventAllDataRowArraySchema.parse(rows);

    //Return Vaidated rows
    return validatedRows;
  }

  //Get all data needed for clean fetch function on table
  async getLowStockPartTableData(page: number = 1, limit: number = 15) {
    const offset = (page - 1) * limit;
    //Build the sql query for joining parts and partlowstockevent tables to get relevent data
    const sql = `SELECT 
        lsp.id AS lowStockId,
        lsp.stockLevel,
        lsp.minStockLevel,
        lsp.sent,
        p.id AS partId,
        p.name,
        p.description,
        p.comment,
        p.averagePrice,
        p.productionRemarks AS partURL
      FROM PartLowStockEvents lsp
      JOIN Part p ON lsp.partId = p.id
      LIMIT ? OFFSET ?`;
    const countSql = 'SELECT COUNT(*) as total FROM PartLowStockEvents'; // Replace with your actual table

    const rows = await this.db.query(sql, [limit, offset]);
    const countResult = await this.db.query(countSql);
    const total: number = countResult[0]?.total || 0;

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
    const sql = 'SELECT * FROM PartLowStockEvents WHERE id = ?';
    //Create rows to store rows that match the query
    const rows = await this.db.query(sql, [id]);
    //return the rows if possible, display null if not

    //Backend ZOD validation
    const validatedData = LowStockEventDataByIdRowArraySchema.parse(rows);

    return validatedData[0] || null;
  }
}
