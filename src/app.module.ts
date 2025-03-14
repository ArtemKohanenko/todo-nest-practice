import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';

@Module({
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
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
