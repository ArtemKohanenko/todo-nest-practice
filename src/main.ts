import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Создаем Swagger документацию на http://localhost:3000/docs
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Todo-list API description')
    .setVersion('1.0')
    .addCookieAuth('token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которые не описаны в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Преобразует данные в соответствующие типы
    }),
  );

  // Позволяет использовать куки
  app.use(cookieParser());

  // Разрешаем только GET,PATCH,POST,DELETE запросы со страницы http://localhost:3000
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
    credentials: false,
  });

  // Запуск сервера
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
