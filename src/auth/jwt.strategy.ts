import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './types';
import { UserService } from 'src/user/user.service';

// Добавляем в RequestType куки, чтобы линтер не ругался
interface RequestWithCookies extends RequestType {
  cookies: {
    token?: string;
  };
}

// Наследуемся от библиотечного PassportStrategy и переопределяем логику
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {    // Внедряем зависимость UserService
    // Вызов конструктора родительского класса
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([     // Определяем, как будем извлекать JWT из запроса,
        JwtStrategy.extractJWT                        // используем кастомный  метод
      ]),
      ignoreExpiration: false,          // Токен с истекшим сроком будет отклонен
      secretOrKey: process.env.JWT_SECRET as string,    // Секретный ключ для подписи JWT
    });
  }

  // Определяем метод для извлечения JWT из cookie
  private static extractJWT = (req: RequestWithCookies): string | null => {
    if (req.cookies && req.cookies.token && req.cookies.token.length > 0) {     // Проверяем наличие токена в куки
      return req.cookies.token;
    }
    throw new UnauthorizedException();
  };

  // Метод валидации содержимого токена
  async validate(payload: JwtPayload) {
    // Проверяем, что пользователь с id из расшифрованного токена существует в БД
    const user = await this.userService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Возвращаемый объект будет доступен через req.user
    return { id: payload.id };
  }
}
