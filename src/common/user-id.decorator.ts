import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types';

// Создаем параметр-декоратор для получения id пользователя из объекта запроса
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    // Проверяем, что AuthGuard добавил данные из JWT в request.user
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return request.user.id;
  },
);
