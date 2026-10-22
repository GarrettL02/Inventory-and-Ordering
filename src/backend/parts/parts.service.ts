import { Injectable } from '@nestjs/common';
import { PartkeeprDatabaseService } from '../partkeeprDatabase/partkeeprDatabase.service';
import {
  GetAllPartsDataRowArraySchema,
  PartDetailsDataRowArraySchema,
} from './schema/parts.schema';

@Injectable()
export class PartService {
  constructor(private readonly db: PartkeeprDatabaseService) {}

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
      FROM Part AS p 
      JOIN StorageLocation sl ON sl.id = p.storageLocation_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) as total 
      FROM Part AS p 
      JOIN StorageLocation sl ON sl.id = p.storageLocation_id
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
    // Build SQL query to grab low stock part by its ID
    const sql = `
    SELECT 
      p.*, 
      p.productionRemarks AS partURL,
      (SELECT pa.filename FROM PartAttachment pa WHERE pa.part_id = p.id LIMIT 1) as filename, 
      sl.name AS storageLocationName,
      m.name AS manufacturerName,
      pm.partNumber AS manufacturerPartNumber
    FROM Part p
    JOIN StorageLocation sl ON sl.id = p.storageLocation_id
    LEFT JOIN PartManufacturer pm ON pm.part_id = p.id
    LEFT JOIN Manufacturer m ON m.id = pm.manufacturer_id
    WHERE p.id = ?
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql, [id]);

    //Validate with ZOD schema
    const validatedData = PartDetailsDataRowArraySchema.parse(rows);

    // Return the row if possible, display null if not
    return validatedData[0] || null;
  }
}
