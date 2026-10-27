import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import { LowStockService } from '../lowStockEvent/lowStockEvent.service';
import { StockMovementsService } from '../stockMovements/stockMovements.service';
import {
  CreatePartDto,
  GetAllPartsDataRowArraySchema,
  PartDetailsDataRowArraySchema,
} from './schema/parts.schema';
import { TotalRowSchema } from '../common/schema/common.schema';

@Injectable()
export class PartService {
  constructor(
    private readonly db: InventoryDatabaseService,
    private readonly lowStockService: LowStockService,
    private readonly stockMovementsService: StockMovementsService,
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
    const queryParams: (string | number)[] = [];

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
      SELECT p.id, p.name, p.description, p.comment, p.averagePrice, sl.name AS storageLocation, p.stockLevel, p.minStockLevel
      FROM parts AS p
      LEFT JOIN storageLocations sl ON sl.id = p.storageLocationId
      ${whereClause}
      ORDER BY p.id
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM parts AS p
      LEFT JOIN storagelocations sl ON sl.id = p.storageLocationId
      ${whereClause}
    `;

    // Execute query with search params followed by pagination variables
    const rows = await this.db.query(sql, [...queryParams, limit, offset]);
    const countResult = await this.db.query(countSql, queryParams);
    const total = TotalRowSchema.parse(countResult[0]).total;

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
    // All part columns (including manufacturerName / manufacturerPartNumber), plus the
    // primary attachment's filename and the storage location's name
    const sql = `
    SELECT
      p.*,
      (SELECT pa.filename
         FROM partattachments pa
         WHERE pa.partId = p.id
         ORDER BY pa.isPrimary DESC, pa.id
         LIMIT 1) AS filename,
      sl.name AS storageLocationName
    FROM parts p
    LEFT JOIN storagelocations sl ON sl.id = p.storageLocationId
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
  //  CreatePart()
  //  Add a new part (the Add New Part form). In one transaction:
  //    - insert the part (internalPartNumber = manufacturerPartNumber)
  //    - log the starting stock in stockMovements (if > 0)
  //    - open a low stock event if it starts below its minimum
  //  Returns the created part in the same shape as getPartById().
  //
  /////////////////////////////////////////////////////////
  async createPart(userId: number | null, input: CreatePartDto) {
    const newPartId = await this.db.transaction(async (tx) => {
      // Check the ids up front so the user gets a clear 400 instead of a foreign key error

      //If there is storageLocation selected, see if it exists in db. If not, throw a BadRequestException.
      if (input.storageLocationId !== null) {
        const rows = await tx.query(
          'SELECT id FROM storageLocations WHERE id = ?',
          [input.storageLocationId],
        );
        if (rows.length === 0) {
          throw new BadRequestException(
            `Storage location ${input.storageLocationId} does not exist`,
          );
        }
      }

      //If there is categoryId selected, see if it exists in db. If not, throw a BadRequestException.
      if (input.categoryId !== null) {
        const rows = await tx.query('SELECT id FROM categories WHERE id = ?', [
          input.categoryId,
        ]);
        if (rows.length === 0) {
          throw new BadRequestException(
            `Category ${input.categoryId} does not exist`,
          );
        }
      }

      //take results of form data and insert into parts table. Then check if part is below minimum stock level and create lowStockEvent if necessary.
      const result = await tx.run(
        `INSERT INTO parts
           (categoryId, storageLocationId, name, description, comment,
            stockLevel, minStockLevel, averagePrice, internalPartNumber,
            manufacturerName, manufacturerPartNumber, partURL)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.categoryId,
          input.storageLocationId,
          input.name,
          input.description,
          input.comment,
          input.stockLevel,
          input.minStockLevel,
          input.averagePrice,
          input.manufacturerPartNumber, // internal part number = manufacturer part number
          input.manufacturerName,
          input.manufacturerPartNumber,
          input.partURL,
        ],
      );
      const partId = result.insertId;

      // If stockLevel > 0, log the starting stock in the stock history.
      if (input.stockLevel > 0) {
        await this.stockMovementsService.record(tx, {
          partId,
          delta: input.stockLevel,
          stockLevelAfter: input.stockLevel,
          reason: 'initial stock',
          userId,
        });
      }

      // Returns null (and does nothing) when the part isn't below its minimum
      await this.lowStockService.syncForPart(
        tx,
        partId,
        input.stockLevel,
        input.minStockLevel,
      );

      return partId;
    });

    return this.getPartById(newPartId);
  }

  /////////////////////////////////////////////////////////
  //
  //  DeletePart()
  //  Permanently delete a part. In one transaction:
  //    - delete the part's open low stock events (ordered = 0). lowStockEvents has
  //      no foreign key on purpose (partId 0 = new-part request), so the database
  //      won't clean these up and they would show up as blank rows
  //    - delete the part. partDistributors, partAttachments and stockMovements
  //      are removed automatically (ON DELETE CASCADE)
  //  Throws 404 if the part doesn't exist.
  //
  /////////////////////////////////////////////////////////
  async deletePart(partId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      //Looks in Low Stock parts to see if part ID is linked, removes from there
      await tx.run(
        'DELETE FROM lowStockEvents WHERE partId = ? AND ordered = 0',
        [partId],
      );

      //result is query to delete the part from the parts table. this includes attachments and stock movements because of ON delete cascade.
      const result = await tx.run('DELETE FROM parts WHERE id = ?', [partId]);

      // Nothing was deleted -> no such part. Throwing rolls back the event delete too
      if (result.affectedRows === 0) {
        throw new NotFoundException(`Part ${partId} not found`);
      }
    });
  }
}
