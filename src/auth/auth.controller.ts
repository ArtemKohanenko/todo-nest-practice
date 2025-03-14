import { BadRequestException, Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService, private readonly userService: UserService) {}

  @Post('register')
  @ApiCookieAuth()
  async register(@Res() res, @Body() registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const payload = { login: user.login, id: user.id };
    res.cookie('token', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + 3600000),
    });
    res.send(user);
  }

  @Post('login')
  async login(@Res() res, @Body() loginDto: LoginDto) {
    const user = await this.userService.comparePassword({login: loginDto.login}, loginDto.password);
    const payload = { username: user.login, id: user.id };
    res.cookie('token', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + 3600000),
    });
    res.send(user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('token', '', { expires: new Date(Date.now()) });
    return {};
  }
}