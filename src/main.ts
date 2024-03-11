import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
