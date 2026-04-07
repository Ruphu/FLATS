import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';

export const Authorizated = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as User;

    return data && user ? user[data] : user;
  },
);
