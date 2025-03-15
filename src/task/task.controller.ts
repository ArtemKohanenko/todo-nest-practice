import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { JwtGuard } from 'src/auth/guards';
import { UserId } from 'src/common/user-id.decorator';
import { TaskDto } from './dto/task.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  // @UserId() извлекает id из токена в куки
  create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: string) {
    // Создаем Task, передаем поля из createTaskDto объединенные с user
    // connect: {id: userId} отвечает за связь между Task и User
    return this.taskService.create({
      ...createTaskDto,
      user: {
        connect: { id: userId },
      },
    });
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiResponse({ status: 200, type: TaskDto, isArray: true })
  findAll(@UserId() userId: string) {
    return this.taskService.findAll({ where: { userId } });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.findOne({ id, userId });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserId() userId: string,
  ) {
    return this.taskService.update({
      where: { id, userId },
      data: updateTaskDto,
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiResponse({ status: 200, type: TaskDto })
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.delete({ id, userId });
  }
}
