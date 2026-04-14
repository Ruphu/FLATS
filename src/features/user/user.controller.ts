import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Put,
} from '@nestjs/common';
import {
  type CreatePreferencesDTO,
  CreatePreferencesSchema,
} from './dto/preferences.dto';
import { ZodExceptionPipe } from '@common/pipes';
import { Authorizated, Authorization } from '@common/decorators';
import type { Preference, User } from '@prisma/client';
import type { IUserService } from './interfaces/user.interfaces';

@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Authorization()
  @Put('preferences')
  async upsertPreferences(
    @Authorizated() user: User,
    @Body(new ZodExceptionPipe(CreatePreferencesSchema))
    preferencesDto: CreatePreferencesDTO,
  ): Promise<Preference> {
    return await this.userService.upsertPreferences(user.id, preferencesDto);
  }

  @Authorization()
  @Get('preferences')
  async getPreferences(@Authorizated('id') id: string): Promise<Preference> {
    return await this.userService.getPreferences(id);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Delete('preferences')
  async deletePreferences(@Authorizated('id') id: string): Promise<void> {
    await this.userService.deletePreferences(id);
  }
}
