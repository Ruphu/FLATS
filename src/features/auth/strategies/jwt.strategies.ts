import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../interfaces/jwt.payload';
import { User } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import type { IAuthService } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
      algorithms: configService.get('jwt.algorithm'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);

    return user;
  }
}
