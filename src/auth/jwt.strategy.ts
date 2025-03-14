import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types';

interface RequestWithCookies extends RequestType {
  cookies: {
    token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  private static extractJWT = (req: RequestWithCookies): string | null => {
    if (req.cookies && req.cookies.token && req.cookies.token.length > 0) {
      return req.cookies.token;
    }
    throw new UnauthorizedException();
  };

  validate(payload: JwtPayload) {
    return { id: payload.id };
  }
}
