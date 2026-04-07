import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/common/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
