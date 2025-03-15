import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  findAll() {
    return this.userService.findAll({});
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserDto })
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: UserDto })
  remove(@Param('id') id: string) {
    return this.userService.delete({ id });
  }
}
