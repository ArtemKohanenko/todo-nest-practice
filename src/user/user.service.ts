import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findAll(params: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }) {
    const user = await this.prisma.user.findMany(params);
    const usersWithoutPassword = user.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    const user = await this.prisma.user.update({
      data,
      where,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.delete({
      where,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // Проверка хэша пароля в БД с хэшем отправленного пароля
  async comparePassword(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    password: string,
  ) {
    const user = await this.findOne(userWhereUniqueInput);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new BadRequestException('Wrong login or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
