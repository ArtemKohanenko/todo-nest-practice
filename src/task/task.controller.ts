import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { JwtGuard } from 'src/auth/guards';
import { UserId } from 'src/common/user-id.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: string) {
    return this.taskService.create(userId, createTaskDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@UserId() userId: string) {
    return this.taskService.findAll({ where: { userId }});
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.findOne({id, userId});
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @UserId() userId: string) {
    return this.taskService.update({where: {id, userId}, data: updateTaskDto});
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.taskService.delete({id, userId});
  }
}
