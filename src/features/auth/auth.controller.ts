import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ZodExceptionPipe } from 'src/common/pipes';
import type { Response } from 'express';
import type { AuthToken, IAuthService } from './interfaces/auth.interface';
import {
  RegistrationDataSchema,
  type RegistrationDataDto,
} from './dto/register.dto';
import {
  LoginCredentialsSchema,
  type LoginCredentialsDto,
} from './dto/login.dto';
import { Authorizated, Authorization } from '@common/decorators';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodExceptionPipe(RegistrationDataSchema))
    registrationDto: RegistrationDataDto,
  ): Promise<AuthToken> {
    const { name, email, password } = registrationDto;

    return await this.authService.register(name, email, password);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodExceptionPipe(LoginCredentialsSchema))
    loginDto: LoginCredentialsDto,
  ): Promise<AuthToken> {
    const { email, password } = loginDto;

    return await this.authService.login(email, password);
  }

  @Authorization()
  @Get('me')
  getProfile(@Authorizated() user: User): Pick<User, 'id' | 'name' | 'email'> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
