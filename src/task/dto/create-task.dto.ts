import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy milk' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Do it fast' })
  @IsString()
  description: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
