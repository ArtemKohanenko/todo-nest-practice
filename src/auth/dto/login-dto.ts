import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'login' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'qwerty' })
  @IsString()
  password: string;
}
