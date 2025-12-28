import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'Vide Record ID' })
    videoId: string;

    @ApiProperty({ example: 1, description: 'Order within the milestone (1, 2, 3...)' })
    order: number;
}
