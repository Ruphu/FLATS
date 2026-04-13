import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import {
  type CreatePreferencesDTO,
  CreatePreferencesSchema,
} from './dto/preferences.dto';
import { ZodExceptionPipe } from '@common/pipes';
import { Authorizated, Authorization } from '@common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Patch('preferences')
  createPreferences(
    @Authorizated('id') id: string,
    @Body(new ZodExceptionPipe(CreatePreferencesSchema))
    createPreferencesDto: CreatePreferencesDTO,
    //TODO: изменить на промис, сделать функцию асинхронной
  ): void {
    const { area } = createPreferencesDto;

    return this.userService.createPreferences(area);
  }

  // получить предпочтения пользователя
  @Authorization()
  @Get('preferences')
  getPreferences(@Authorizated('id') id: string) {
    return this.userService.getPreferences(id);
  }
}
