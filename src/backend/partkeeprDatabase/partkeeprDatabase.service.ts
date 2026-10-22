// import { Injectable } from '@nestjs/common';
// import { createPool, Pool } from 'mysql2/promise';

// @Injectable()
// export class PartkeeprDatabaseService {
//   private pool: Pool;

//   constructor() {
//     this.pool = createPool({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });
//   }

//   async query(sql: string, params?: any[]) {
//     const [rows] = await this.pool.execute(sql, params);
//     return rows;
//   }
// }

import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class PartkeeprDatabaseService {
  private pool: Pool | null = null;

  private getPool(): Pool {
    if (!this.pool) {
      this.pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    return this.pool;
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const [rows] = await this.getPool().execute(sql, params);
    return rows as any[];
  }
}
