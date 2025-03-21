import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  BadRequestException,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserId } from 'src/common/user-id.decorator';
import { JwtGuard } from 'src/auth/guards';
import { LoginDto } from './dto/login-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}   // Внедряем зависимость UserService

  @Post()
  @ApiResponse({ status: 200, type: UserDto })    // Документируем ответ с кодом 200
  @ApiResponse({                                  // Документируем ответ с кодом 400 (Bad Request error)
    status: 400,
    description: 'User with this login already exists',
  })
  async createUser(
    @Body() registerDto: LoginDto   // Получем body запроса, валидируем по схеме LoginDto
  ) {
    const passwordHash = await this.userService.hashPassword(       // Хэш-преобразование пароля
      registerDto.password,
    );

    const userWithSameLogin = await this.userService.findOne({  // Проверяем наличие пользователя с таким же логином
      login: registerDto.login,
    });
    if (userWithSameLogin) {
      // Отправляем 400 ошибку
      throw new BadRequestException('User with this login already exists');
    }
    const user = await this.userService.create({
      login: registerDto.login,
      passwordHash,
    });

    return user;
  }

  @UseGuards(JwtGuard)
  @Get('me')
  @ApiResponse({ status: 200, type: UserDto })
  findOne(@UserId() id: string) {
    return this.userService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({
    status: 400,
    description: 'User with this login already exists',
  })
  async update(@UserId() id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.login) {
      const userWithSameLogin = await this.userService.findOne({
        login: updateUserDto.login,
      });

      if (userWithSameLogin) {
        throw new BadRequestException('User with this login already exists');
      }
    }

    return await this.userService.update({
      where: { id },
      data: updateUserDto,
    });
  }

  @UseGuards(JwtGuard)
  @Delete('me')
  @ApiResponse({ status: 200, type: UserDto })
  remove(@UserId() id: string) {
    return this.userService.delete({ id });
  }
}
