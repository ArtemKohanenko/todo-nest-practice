import { Injectable } from '@nestjs/common';
import { Task, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findOne(taskWhereInput: Prisma.TaskWhereInput): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: taskWhereInput,
    });
  }

  async findAll(params: { where?: Prisma.TaskWhereInput }): Promise<Task[]> {
    return this.prisma.task.findMany(params);
  }

  async create(userId: string, data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    return this.prisma.task.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }
}
