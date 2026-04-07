import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { JwtPayload } from './interfaces/jwt.payload';
import { User } from '@prisma/client';
import { AuthToken } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL =
      this.configService.getOrThrow<number>('jwt.accessTokenTtl');
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthToken> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    return this.auth(user.id);
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or invalid credentials');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User not found or invalid credentials');
    }

    return this.auth(user.id);
  }

  private auth(id: string): AuthToken {
    const { accessToken } = this.generateTokens(id);

    return { accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    return { accessToken };
  }
}
