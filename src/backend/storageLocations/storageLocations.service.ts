import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStorageLocationDto,
  StorageLocationDataSchema,
} from './schema/storageLocations.schema';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';

@Injectable()
export class StorageLocationsService {
  constructor(private readonly db: InventoryDatabaseService) {}

  /////////////////////////////////////////////////////////
  //
  //  GetAllStorageLocations()
  //  Get all storage locations
  //
  /////////////////////////////////////////////////////////
  async getAllStorageLocations() {
    const sql = `
    SELECT
      id,
      name
    FROM storageLocations
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql);

    //Validate each row with ZOD schema
    const validatedData = rows.map((row) =>
      StorageLocationDataSchema.parse(row),
    );

    return { data: validatedData };
  }

  /////////////////////////////////////////////////////////
  //
  //  GetStorageLocationById()
  //  Get the storage location for one part, by the part's ID
  //
  /////////////////////////////////////////////////////////
  async getStorageLocationById(storageLocationId: number) {
    const sql = `
    SELECT
      id,
      name
    FROM storageLocations
    WHERE id = ?
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql, [storageLocationId]);

    const row = rows[0];

    if (!row) {
      throw new NotFoundException(
        `Storage location ${storageLocationId} not found`,
      );
    }

    //Validate with ZOD schema
    const validatedData = StorageLocationDataSchema.parse(row);

    return { data: validatedData };
  }

  /////////////////////////////////////////////////////////
  //
  //  CreateStorageLocation()
  //  Add a new storage location (name only).
  //  Names are unique, and the column's collation ignores case, so "Bin A"
  //  and "bin a" count as the same name. Throws 409 if the name is taken.
  //  Returns the created location in the same shape as getStorageLocationById().
  //
  /////////////////////////////////////////////////////////
  async createStorageLocation(input: CreateStorageLocationDto) {
    let newId: number;

    try {
      const result = await this.db.run(
        'INSERT INTO storageLocations (name) VALUES (?)',
        [input.name],
      );
      newId = result.insertId;
    } catch (error) {
      // The unique key on name rejected it. Catching the database error (instead of
      // checking with a SELECT first) is safe even if two people add the same name at once.
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `A storage location named "${input.name}" already exists`,
        );
      }
      throw error;
    }

    return this.getStorageLocationById(newId);
  }

  /////////////////////////////////////////////////////////
  //
  //  DeleteStorageLocation()
  //  Permanently delete a storage location. In one transaction:
  //    - delete the part's open low stock events (ordered = 0). lowStockEvents has
  //      no foreign key on purpose (partId 0 = new-part request), so the database
  //      won't clean these up and they would show up as blank rows
  //    - delete the storage location. related entries are removed automatically (ON DELETE CASCADE)
  //  Throws 404 if the storage location doesn't exist.
  //
  /////////////////////////////////////////////////////////
  async deleteStorageLocation(storageLocationId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      // Count parts still using this location
      const rows = await tx.query(
        'SELECT COUNT(*) AS total FROM parts WHERE storageLocationId = ?',
        [storageLocationId],
      );
      const total = Number(rows[0].total);

      if (total > 0) {
        throw new ConflictException(
          `Can't delete this storage location: ${total} part${total === 1 ? ' is' : 's are'} still stored there. Move them first.`,
        );
      }

      const result = await tx.run('DELETE FROM storageLocations WHERE id = ?', [
        storageLocationId,
      ]);

      if (result.affectedRows === 0) {
        throw new NotFoundException(
          `Storage location ${storageLocationId} not found`,
        );
      }
    });
  }
}
