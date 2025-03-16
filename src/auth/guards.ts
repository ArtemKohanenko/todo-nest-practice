import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Наследуемся от библиотечного AuthGuard со стратегией для JWT
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
