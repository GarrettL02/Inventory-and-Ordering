import { Injectable } from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import { PartDistributorRowArraySchema } from './schema/partDistributor.schema';

@Injectable()
export class PartDistributorService {
  constructor(private readonly db: InventoryDatabaseService) {}

  // Get distributor data columns for specific part
  async getPartDistributorsById(partId: number) {
    const sql = `SELECT distributor, distributorPartNumber, productURL FROM partDistributors WHERE partId = ?`;
    const rows = await this.db.query(sql, [partId]);

    //Backend ZOD validation
    const validatedRows = PartDistributorRowArraySchema.parse(rows);

    //Return Vaidated rows
    return validatedRows;
  }
}
