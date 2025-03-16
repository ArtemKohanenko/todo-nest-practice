import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    // Поиск пользователя
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) {
      return null;
    }

    // Убираем поле passwordHash из ответа
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Тот же самый метод, но оставляет passwordHash
  async findOneWithHash(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    // Создаем пользователя
    const user = await this.prisma.user.create({
      data,
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
    // Обновляем
    const user = await this.prisma.user.update({
      data,
      where,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    // Удаляем
    const user = await this.prisma.user.delete({
      where,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // Генерация хэша пароля
  async hashPassword(password: string): Promise<string> {
    // Генерация соли
    const salt = await bcrypt.genSalt();
    // Генерация хэша
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  // Сравнение хэша пароля в БД с хэшем отправленного пароля
  async comparePassword(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    password: string,
  ) {
    // Проверяем, что пользователь существует
    const user = await this.findOneWithHash(userWhereUniqueInput);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    // Вычисляем хэш password и сравниваем с user.passwordHash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new BadRequestException('Wrong login or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
