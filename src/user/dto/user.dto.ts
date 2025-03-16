import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

// UserDto наследует тип User, но без поля passwordHash
export class UserDto implements Omit<User, 'passwordHash'> {
  @ApiProperty({ example: 'id' })
  id: string;

  @ApiProperty({ example: 'login' })
  login: string;

  @ApiProperty({ example: '2025-03-15T05:52:13.908Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-03-15T05:52:13.908Z' })
  updatedAt: Date;
}
