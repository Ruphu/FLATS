import { JwtGuard } from '@common/guards';
import { applyDecorators, UseGuards } from '@nestjs/common';

export const Authorization = () => {
  return applyDecorators(UseGuards(JwtGuard));
};
