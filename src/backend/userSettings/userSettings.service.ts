import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  UserSettings,
  UserSettingsSchema,
  DEFAULT_USER_SETTINGS,
  UpdateUserSettingsDto,
} from './schema/userSettings.schema';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';

// TypeScript will error if you add a setting to the schema but forget it here
const SETTING_COLUMNS = {
  theme: 'theme',
} as const satisfies Record<keyof UserSettings, string>;

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);
  constructor(private readonly db: InventoryDatabaseService) {}

  async getUserSettings(userId: number) {
    const columns = Object.values(SETTING_COLUMNS).join(', ');
    try {
      const rows = await this.db.query(
        `SELECT ${columns} FROM userSettings WHERE userId = ?`,
        [userId],
      );
      // Defaults fill in anything missing; zod validates the rest
      const data = UserSettingsSchema.parse({
        ...DEFAULT_USER_SETTINGS,
        ...(rows[0] ?? {}),
      });
      return { data };
    } catch (err) {
      this.logger.error(`Failed to load settings for user ${userId}`, err);
      throw new InternalServerErrorException('Could not load user settings');
    }
  }

  async updateSettings(userId: number, input: UpdateUserSettingsDto) {
    const entries = Object.entries(input) as [keyof UserSettings, unknown][];
    const columns = entries.map(([key]) => SETTING_COLUMNS[key]);
    const values = entries.map(([, value]) => value);

    const sql = `
      INSERT INTO userSettings (userId, ${columns.join(', ')})
      VALUES (?, ${columns.map(() => '?').join(', ')})
      ON DUPLICATE KEY UPDATE ${columns.map((c) => `${c} = VALUES(${c})`).join(', ')}
    `;

    try {
      await this.db.run(sql, [userId, ...values]);
    } catch (err) {
      this.logger.error(`Failed to update settings for user ${userId}`, err);
      throw new InternalServerErrorException('Could not save user settings');
    }
    return this.getUserSettings(userId);
  }
}
