import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = app.get(ConfigService);

  await app.listen(config.getOrThrow<number>('app.port') || 5000);
}
void bootstrap();
