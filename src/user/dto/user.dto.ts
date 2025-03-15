import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserDto implements Omit<User, 'passwordHash'> {
    @ApiProperty({ example: 'id' })
    id: string;

    @ApiProperty({ example: 'login' })
    login: string;
}