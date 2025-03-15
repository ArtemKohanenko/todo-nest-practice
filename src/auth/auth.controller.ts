import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

const SEVEN_DAYS_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 200, description: 'User with this login already exists' })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: LoginDto,
  ) {
    const passwordHash = await this.authService.hashPassword(registerDto.password);

    const userWithSameLogin = await this.userService.findOne({
      login: registerDto.login
    })
    if (userWithSameLogin) {
      throw new BadRequestException('User with this login already exists');
    }
    const user = await this.userService.create({ login: registerDto.login, passwordHash });

    const payload = { login: user.login, id: user.id };
    res.cookie('token', this.jwtService.sign(payload), {    // Добавляет token в cookie
      httpOnly: true, // Защита от XSS!!!
      expires: new Date(Date.now() + SEVEN_DAYS_MILLISECONDS),
    });
    
    return user;
  }

  @Post('login')
  @ApiResponse({ status: 200, type: UserDto })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const user = await this.userService.comparePassword(
      { login: loginDto.login },
      loginDto.password,
    );
    const payload = { username: user.login, id: user.id };
    res.cookie('token', this.jwtService.sign(payload), {
      httpOnly: true, // Защита от XSS!!!
      expires: new Date(Date.now() + SEVEN_DAYS_MILLISECONDS),
    });
    return user;
  }

  @Post('logout')
  @ApiResponse({ status: 200 })
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', {             // Удаляем token из cookie
      expires: new Date(Date.now()),
      httpOnly: true, // Защита от XSS!!!
    })
    return {};
  }
}
