import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({ example: 'Buy milk' })
    @IsString()
    text: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    done?: boolean;

    @ApiProperty({ example: 'ff3ad9da-ad83-4c96-8d11-51f39bbfea18' })
    @IsString()
    userId: string;
}
