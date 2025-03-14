import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'login' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'qwerty' })
  @IsString()
  password: string;
}
