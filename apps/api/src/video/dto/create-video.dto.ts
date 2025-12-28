import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateVideoDto {
    @ApiProperty({ example: 'Introduction to Arrays', description: 'YouTube video title' })
    ytVideoTitle: string;

    @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'YouTube video ID (unique)' })
    ytVideoId: string;

    @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Full YouTube URL' })
    ytVideoUrl: string;

    @ApiProperty({ example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', description: 'Video thumbnail URL' })
    ytVideoThumbnail: string;

    @ApiProperty({ example: ['javascript', 'arrays', 'tutorial'], description: 'YouTube video tags' })
    ytVideoTags: string[];

    @ApiPropertyOptional({ example: 600, description: 'Video duration in seconds (fetched async, nullable)' })
    ytVideoDuration?: number;
}
