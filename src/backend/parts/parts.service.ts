import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import { LowStockService } from '../lowStockEvent/lowStockEvent.service';
import {
  AdjustStockDto,
  GetAllPartsDataRowArraySchema,
  PartDetailsDataRowArraySchema,
} from './schema/parts.schema';

@Injectable()
export class PartService {
  constructor(
    private readonly db: InventoryDatabaseService,
    private readonly lowStockService: LowStockService,
  ) {}

  ///////////////////////////////////////////////////////////
  //
  //  GetAllParts()
  //  Get all parts with pagination and search filtering
  //
  /////////////////////////////////////////////////////////
  async getAllParts(page: number = 1, limit: number = 15, search?: string) {
    const offset = (page - 1) * limit;

    // Base SQL string structures
    let whereClause = '';
    const queryParams: any[] = [];

    if (search && search.trim() !== '') {
      // 1. Split query by spaces and ignore extra whitespace
      const keywords = search.trim().split(/\s+/);

      // 2. Build an AND condition for each keyword
      const tokenConditions = keywords.map((keyword) => {
        const searchWildcard = `%${keyword}%`;

        // Push the wildcard once for each searchable column
        queryParams.push(
          searchWildcard,
          searchWildcard,
          searchWildcard,
          searchWildcard,
        );

        // Each word must match at least ONE column
        return `(p.name LIKE ? OR p.description LIKE ? OR p.comment LIKE ? OR sl.name LIKE ?)`;
      });

      // 3. Combine all word requirements with AND
      whereClause = ` WHERE ` + tokenConditions.join(' AND ');
    }

    const sql = `
      SELECT p.id, p.name, p.description, p.comment, p.averagePrice, sl.name AS storageLocation, p.stockLevel
      FROM parts AS p
      JOIN storageLocations sl ON sl.id = p.storageLocationId
      ${whereClause}
      ORDER BY p.id
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM parts AS p
      JOIN storageLocations sl ON sl.id = p.storageLocationId
      ${whereClause}
    `;

    // Execute query with search params followed by pagination variables
    const rows = await this.db.query(sql, [...queryParams, limit, offset]);
    const countResult: any[] = await this.db.query(countSql, queryParams);
    const total: number = countResult[0]?.total || 0;

    // Validate data with ZOD schema
    const validatedData = GetAllPartsDataRowArraySchema.parse(rows);

    return {
      data: validatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /////////////////////////////////////////////////////////
  //
  //  GetPartById()
  //  From all parts - Get a part by its ID
  //
  /////////////////////////////////////////////////////////
  async getPartById(id: number) {
    // Primary attachment first, and the first manufacturer entry if there are several
    const sql = `
    SELECT
      p.*,
      (SELECT pa.filename
         FROM partAttachments pa
         WHERE pa.partId = p.id
         ORDER BY pa.isPrimary DESC, pa.id
         LIMIT 1) AS filename,
      sl.name AS storageLocationName,
      m.name AS manufacturerName,
      pm.partNumber AS manufacturerPartNumber
    FROM parts p
    JOIN storageLocations sl ON sl.id = p.storageLocationId
    LEFT JOIN partManufacturers pm
      ON pm.id = (SELECT MIN(pm2.id) FROM partManufacturers pm2 WHERE pm2.partId = p.id)
    LEFT JOIN manufacturers m ON m.id = pm.manufacturerId
    WHERE p.id = ?
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql, [id]);

    //Validate with ZOD schema
    const validatedData = PartDetailsDataRowArraySchema.parse(rows);

    // Return the row if possible, display null if not
    return validatedData[0] || null;
  }

  /////////////////////////////////////////////////////////
  //
  //  AdjustStock()
  //  Change a part's stock by delta, log it in stockMovements, and create or
  //  update the low stock event if the part is now below its minimum.
  //  Everything happens in one transaction, so it all succeeds or none of it does.
  //
  /////////////////////////////////////////////////////////
  async adjustStock(
    partId: number,
    userId: number | null,
    input: AdjustStockDto,
  ) {
    return this.db.transaction(async (tx) => {
      // Lock the row so two changes at the same time can't overwrite each other
      const rows = await tx.query(
        'SELECT id, stockLevel, minStockLevel FROM parts WHERE id = ? FOR UPDATE',
        [partId],
      );
      const part = rows[0];

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

      await tx.run(
        `INSERT INTO stockMovements (partId, delta, stockLevelAfter, reason, userId)
         VALUES (?, ?, ?, ?, ?)`,
        [partId, input.delta, newStockLevel, input.reason, userId],
      );

      const lowStockEventId = await this.lowStockService.syncForPart(
        tx,
        partId,
        newStockLevel,
        part.minStockLevel,
      );

      return {
        partId,
        stockLevel: newStockLevel,
        minStockLevel: part.minStockLevel as number,
        lowStockEventId,
      };
    });
  }
}
