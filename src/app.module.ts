import { Module } from '@nestjs/common';
import { AuthModule } from '@features/auth/auth.module';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import config from '@common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule {}
