import { ConflictException, Injectable } from '@nestjs/common';
import {
  DbTransaction,
  InventoryDatabaseService,
} from '../databaseService/inventoryDatabase.service';
import {
  AddPartDistributorDto,
  PartDistributorRowArraySchema,
} from './schema/partDistributor.schema';

@Injectable()
export class PartDistributorService {
  constructor(private readonly db: InventoryDatabaseService) {}

  ///////////////////////////////////////////////////////////
  //
  //  getPartDistributorById()
  //  Get distributor data columns for specific part
  //
  ///////////////////////////////////////////////////////////
  async getPartDistributorsById(partId: number) {
    const sql = `SELECT id, partId, distributor, distributorPartNumber, productURL FROM partDistributors WHERE partId = ?`;
    const rows = await this.db.query(sql, [partId]);

    //Backend ZOD validation
    const validatedRows = PartDistributorRowArraySchema.parse(rows);

    //Return Vaidated rows
    return validatedRows;
  }

  ///////////////////////////////////////////////////////////
  //
  //  addPartDistributor()
  //  Add a new part distributor entry
  //
  ///////////////////////////////////////////////////////////
  async addPartDistributor(
    tx: DbTransaction,
    input: AddPartDistributorDto,
  ): Promise<number> {
    try {
      const result = await tx.run(
        'INSERT INTO partDistributors (partId, distributor, distributorPartNumber, productURL) VALUES (?, ?, ?, ?)',
        [
          input.partId,
          input.distributor,
          input.distributorPartNumber,
          input.productUrl,
        ],
      );
      return result.insertId;
    } catch (error: any) {
      // uq_partDistributors_part_distributor: one row per part + distributor
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Part ${input.partId} already has a ${input.distributor} entry`,
        );
      }
      throw error;
    }
  }
}
