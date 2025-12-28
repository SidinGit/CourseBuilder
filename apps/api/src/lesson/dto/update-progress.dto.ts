import { ApiProperty } from "@nestjs/swagger";

export class UpdateProgressDto {
    @ApiProperty({ example: 120, description: 'Watched time in seconds' })
    watchedTime: number;
}