import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './types';
import { UserService } from 'src/user/user.service';

interface RequestWithCookies extends RequestType {
  cookies: {
    token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Определяем метод для извлечения JWT из cookie
  private static extractJWT = (req: RequestWithCookies): string | null => {
    if (req.cookies && req.cookies.token && req.cookies.token.length > 0) {
      return req.cookies.token;
    }
    throw new UnauthorizedException();
  };

  // Метод валидации содержимого токена. Возвращаемое значение будет сохранено в req.user
  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: payload.id };
  }
}
