import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './types';

interface RequestWithCookies extends RequestType {
  cookies: {
    token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
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
