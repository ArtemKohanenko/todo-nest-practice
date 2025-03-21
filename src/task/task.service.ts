import { Injectable } from '@nestjs/common';
import { Task, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

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

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
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
