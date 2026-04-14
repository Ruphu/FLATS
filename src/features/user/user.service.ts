import { PrismaService } from '@infra/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Preference } from '@prisma/client';
import type { CreatePreferencesDTO } from './dto/preferences.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertPreferences(
    userId: string,
    data: CreatePreferencesDTO,
  ): Promise<Preference> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.prisma.preference.upsert({
      where: { userId },
      create: {
        ...data,
        userId,
      },
      update: data,
    });
  }

  async getPreferences(userId: string): Promise<Preference> {
    const preferences = await this.prisma.preference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new NotFoundException('Preferences not found');
    }

    return preferences;
  }

  async deletePreferences(userId: string): Promise<void> {
    await this.getPreferences(userId);

    await this.prisma.preference.delete({
      where: { userId },
    });

    return;
  }
}
