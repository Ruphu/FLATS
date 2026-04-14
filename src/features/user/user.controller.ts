import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  type CreatePreferencesDTO,
  type UpdatePreferencesDTO,
  CreatePreferencesSchema,
  UpdatePreferencesSchema,
} from './dto/preferences.dto';
import { ZodExceptionPipe } from '@common/pipes';
import { Authorizated, Authorization } from '@common/decorators';
import type { Preference } from '@prisma/client';
import type { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Post('preferences')
  async createPreferences(
    @Authorizated() user: User,
    @Body(new ZodExceptionPipe(CreatePreferencesSchema))
    createPreferencesDto: CreatePreferencesDTO,
  ): Promise<Preference> {
    return await this.userService.createPreferences(user.id, createPreferencesDto);
  }

  @Authorization()
  @Get('preferences')
  async getPreferences(
    @Authorizated() user: User): Promise<Preference> {
    return await this.userService.getPreferences(user.id);
  }

  @Authorization()
  @Patch('preferences')
  async updatePreferences(
    @Authorizated() user: User,
    @Body(new ZodExceptionPipe(UpdatePreferencesSchema))
    updatePreferencesDto: UpdatePreferencesDTO,
  ): Promise<Preference> {
    return await this.userService.updatePreferences(user.id, updatePreferencesDto);
  }

  @Authorization()
  @Delete('preferences')
  async deletePreferences(
    @Authorizated() user: User
  ): Promise<{ message: string }> {
    return await this.userService.deletePreferences(user.id);
  }


}
