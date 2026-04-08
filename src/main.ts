import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Levantar erro quando o campo não existir
    transform: true, // transforma tipos de parâmetros e DTOs (ex.: query string para number)
  })
);
  await app.listen(3000);
}
bootstrap();
