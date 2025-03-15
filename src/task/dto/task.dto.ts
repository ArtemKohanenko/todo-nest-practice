import { ApiProperty } from "@nestjs/swagger";
import { Task } from "@prisma/client";

export class TaskDto implements Task {
    @ApiProperty({ example: 'id' })
    id: string;

    @ApiProperty({ example: 'text' })
    text: string;

    @ApiProperty({ example: false })
    done: boolean;

    @ApiProperty({ example: 'userId' })
    userId: string;

    @ApiProperty({ example: '2025-03-15T05:52:13.908Z' })
    createdAt: Date;
}