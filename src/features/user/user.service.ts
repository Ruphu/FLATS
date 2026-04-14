import { PrismaService } from '@infra/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Preference } from '@prisma/client';
import { CreatePreferencesDTO } from './dto/preferences.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createPreferences(
    userId: string, 
    data: CreatePreferencesDTO): Promise<Preference> {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const exsistingPreferences = await this.prisma.preference.findUnique({
        where: { userId }
      });
      if (exsistingPreferences) {
        throw new BadRequestException('Preferences for this user already exist');
      }

      const preferences = await this.prisma.preference.create({
        data: {
          ...data,
          userId,
        }
      });

      return preferences;
    }
  
   async getPreferences(userId: string): Promise<Preference> {
    const preferences = await this.prisma.preference.findUnique({
      where: {userId}
    }) 

    if (!preferences){
      throw new BadRequestException('Preferences not found');
    }

    return preferences;
  }

  async updatePreferences(
    userId: string, 
    data: Partial<CreatePreferencesDTO>
  ): Promise<Preference> {
    await this.getPreferences(userId);

    return this.prisma.preference.update({
      where: { userId },
      data,
    });
  }

  async deletePreferences(userId: string): Promise<{ message: string }> {
    await this.getPreferences(userId);

    await this.prisma.preference.delete({
      where: { userId },
    });

    return {message: 'Preferences deleted successfully'};
  }
}

