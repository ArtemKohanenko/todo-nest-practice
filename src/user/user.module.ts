import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  // 
  controllers: [UserController],
  // Сервисы с бизнес-логикой
  providers: [UserService, PrismaService],
  // Экспортированные сервисы можно использовать в других модулях
  exports: [UserService],
})
export class UserModule {}
