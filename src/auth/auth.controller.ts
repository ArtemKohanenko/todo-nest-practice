import { Body, Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiCookieAuth()
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const user = await this.userService.create(registerDto);
    const payload = { login: user.login, id: user.id };
    res.cookie('token', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + 3600000),
    });
    return user;
  }

  @Post('login')
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
      expires: new Date(Date.now() + 3600000),
    });
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', { expires: new Date(Date.now()) });
    return {};
  }
}
