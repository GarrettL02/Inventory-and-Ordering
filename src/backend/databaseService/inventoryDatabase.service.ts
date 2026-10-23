import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  createPool,
  Pool,
  PoolConnection,
  ResultSetHeader,
} from 'mysql2/promise';

// Query helpers handed to the callback of transaction().
// Pass the row type to get typed rows back: tx.query<PartStockRow>(sql, params)
export type DbTransaction = {
  query: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  run: (sql: string, params?: any[]) => Promise<ResultSetHeader>;
};

@Injectable()
export class InventoryDatabaseService implements OnModuleDestroy {
  private pool: Pool | null = null;

  private getPool(): Pool {
    if (!this.pool) {
      this.pool = createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    return this.pool;
  }

  ///////////////////////////////////////////////////////////
  //
  //  query()
  //  SELECT statements - returns the rows.
  //  Pass the row type for typed rows: this.db.query<PartTableDataRow>(sql, params)
  //
  ///////////////////////////////////////////////////////////
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this.getPool().execute(sql, params);
    return rows as T[];
  }

  ///////////////////////////////////////////////////////////
  //
  //  run()
  //  INSERT / UPDATE / DELETE - returns insertId and affectedRows
  //
  ///////////////////////////////////////////////////////////
  async run(sql: string, params?: any[]): Promise<ResultSetHeader> {
    const [result] = await this.getPool().execute<ResultSetHeader>(
      sql,
      params,
    );
    return result;
  }

  ///////////////////////////////////////////////////////////
  //
  //  transaction()
  //  Run several statements as one unit. Commits when the callback
  //  finishes, rolls everything back if it throws.
  //
  ///////////////////////////////////////////////////////////
  async transaction<T>(work: (tx: DbTransaction) => Promise<T>): Promise<T> {
    const connection: PoolConnection = await this.getPool().getConnection();

    try {
      await connection.beginTransaction();

      const result = await work({
        query: async <R = any>(sql: string, params?: any[]): Promise<R[]> => {
          const [rows] = await connection.execute(sql, params);
          return rows as R[];
        },
        run: async (sql: string, params?: any[]) => {
          const [header] = await connection.execute<ResultSetHeader>(
            sql,
            params,
          );
          return header;
        },
      });

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
