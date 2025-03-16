import { Body, Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../user/dto/login-dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

// 7 дней в миллисекундах
const SEVEN_DAYS_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiResponse({ status: 200, type: UserDto })
  async login(
    // passthrough позволяет использовать @Res() и return в одном методе
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    // Сравниваем отправленный пароль с сохраненным в БД
    const user = await this.userService.comparePassword(
      { login: loginDto.login },
      loginDto.password,
    );
    // Данные, которые будут закодированы в JWT
    const payload = { id: user.id };

    // Добавляем cookie
    res.cookie('token', this.jwtService.sign(payload), {
      httpOnly: true, // Фронтенд не сможет прочитать токен, защита от XSS
      expires: new Date(Date.now() + SEVEN_DAYS_MILLISECONDS), // Истекает через 7 дней
    });

    return user;
  }

  @Post('logout')
  @ApiResponse({ status: 200 })
  logout(@Res({ passthrough: true }) res: Response) {
    // Удаляем токен из cookie
    res.cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true, // Защита от XSS
    });
    return {};
  }
}
