import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';

@Module({
  // Импортированные модули в модуль App
  imports: [
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TaskModule,
    UserModule,
    AuthModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
