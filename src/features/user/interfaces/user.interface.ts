import { Preference } from '@prisma/client';
import { CreatePreferencesDTO } from '../dto/preferences.dto';

export interface IUserService {
  upsertPreferences(
    userId: string,
    data: CreatePreferencesDTO,
  ): Promise<Preference>;

  getPreferences(userId: string): Promise<Preference>;

  deletePreferences(userId: string): Promise<void>;
}
