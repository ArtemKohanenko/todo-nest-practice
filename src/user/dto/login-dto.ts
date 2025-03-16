import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'login' })   // Отображаем поле в swagger документации
  @IsString()                          // Валидация строки
  login: string;

  @ApiProperty({ example: 'qwerty' })
  @IsString()
  password: string;
}
