import type { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>('jwt.secret'),
  signOptions: { algorithm: config.get('jwt.algorithm') },
  verifyOptions: {
    algorithms: config.get('jwt.algorithm'),
    ignoreExpiration: false,
  },
});
