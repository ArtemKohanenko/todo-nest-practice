import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy milk' })
  @IsString()
  text: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
