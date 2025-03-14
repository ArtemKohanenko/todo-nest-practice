import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from 'src/auth/dto/register-dto';
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
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const user = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    const usersWithoutPassword = user.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async create(data: RegisterDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: {
        login: data.login,
        passwordHash: hash,
      },
    });
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
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.delete({
      where,
    });
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async comparePassword(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    password: string,
  ): Promise<User> {
    const user = await this.findOne(userWhereUniqueInput);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new BadRequestException('Wrong login or password');
    }

    return user;
  }
}
