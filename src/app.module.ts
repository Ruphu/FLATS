import { Module } from '@nestjs/common';
import { AuthModule } from '@features/auth/auth.module';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import config from '@common/config';
import { UserModule } from '@features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
