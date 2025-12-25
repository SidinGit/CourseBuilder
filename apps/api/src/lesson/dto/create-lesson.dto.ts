import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty({ example: 'Introduction to Arrays', description: 'YouTube video title' })
    title: string;

    @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'YouTube video ID' })
    videoId: string;

    @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Full YouTube video URL' })
    videoUrl: string;

    @ApiProperty({ example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', description: 'Video thumbnail URL' })
    thumbnail: string;

    @ApiProperty({ example: 600, description: 'Video duration in seconds' })
    duration: number;

    @ApiProperty({ example: 1, description: 'Order within the milestone (1, 2, 3...)' })
    order: number;
}
