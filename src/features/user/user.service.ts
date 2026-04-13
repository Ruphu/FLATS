import { PrismaService } from '@infra/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Preference } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createPreferences(area: number) {
    console.log('Creating preferences with area:', area);
  }

  async getPreferences(userId: string): Promise<Preference> {
    const pref = await this.prisma.preference.findUnique({
      where: { userId },
    });

    if (!pref) {
      throw new BadRequestException(
        'Preferences not found for user with id: ' + userId,
      );
    }

    console.log('User preferences:', pref);
    return pref;
  }
}
