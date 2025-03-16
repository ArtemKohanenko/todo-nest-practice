import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  // Другие модули, импортированные в App
  imports: [TaskModule, UserModule, AuthModule],
})
export class AppModule {}
