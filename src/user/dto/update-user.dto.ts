import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'login',
  })
  @IsString()
  @IsOptional()
  login?: string;
}
