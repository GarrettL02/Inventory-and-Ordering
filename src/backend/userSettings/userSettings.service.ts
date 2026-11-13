import { Injectable } from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import {
  UpdateUserSettingsDto,
  UserSettingsSchema,
} from './schema/userSettings.schema';

@Injectable()
export class UserSettingsService {
  constructor(private readonly db: InventoryDatabaseService) {}

  /////////////////////////////////////////////////////////
  //
  //  getUserSettings()
  //  Get the user settings
  //
  /////////////////////////////////////////////////////////
  async getUserSettings(userId: number) {
    const sql = `
    SELECT
      theme
    FROM userSettings
    WHERE userId = ?
  `;

    // Create rows to store rows that match the query
    const rows = await this.db.query(sql, [userId]);

    //Validate with ZOD schema - if no settings exist default to dark
    const validatedData = UserSettingsSchema.parse(
      rows[0] ?? { theme: 'dark' },
    );

    return { data: validatedData };
  }

  async updateSettings(userId: number, input: UpdateUserSettingsDto) {
    await this.db.run(
      `INSERT INTO userSettings (userId, theme) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE theme = ?`,
      [userId, input.theme, input.theme],
    );
    return this.getUserSettings(userId);
  }
}
