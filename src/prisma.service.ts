import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Сервис используется другими сервисами для запросов к БД через Prisma ORM
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Подключаемся к БД при инициализации модуля
  async onModuleInit() {
    await this.$connect();
  }
}
