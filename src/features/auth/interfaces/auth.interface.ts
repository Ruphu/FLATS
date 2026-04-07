import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtPayload } from './jwt.payload';

export type AuthToken = {
  accessToken: string;
};

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<AuthToken>;
  login(email: string, password: string): Promise<AuthToken>;
  me(user: User): Promise<Pick<User, 'id' | 'name' | 'email'> | null>;

  validateUser(payload: JwtPayload): Promise<User>;
}
