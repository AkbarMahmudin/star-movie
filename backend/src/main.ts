import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './libs/interceptors';
import { HttpExceptionFilter } from './libs/filters/http-exception.filter';
import { PrismaExceptionFilter } from './libs/filters/prisma-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true, // menghapus field yang tidak didefinisikan di DTO
      forbidNonWhitelisted: true, // melempar error jika ada field asing
      transform: true, // auto transform string jadi number, boolean, dll
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  await app.listen(config.get('app.port') || 3000);
}
bootstrap();
