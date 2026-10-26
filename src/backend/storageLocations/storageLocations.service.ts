import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageLocationDataSchema } from './schema/storageLocations.schema';
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
    const validatedData = rows.map((row) => StorageLocationDataSchema.parse(row));

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
}
