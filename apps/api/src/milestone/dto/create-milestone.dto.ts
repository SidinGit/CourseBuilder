import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateMilestoneDto {
    @ApiProperty({ example: 'Introduction to Arrays' })
    title: string

    @ApiPropertyOptional({ example: 'Learn the basics of arrays and their operations' })
    description?: string

    @ApiProperty({ example: 1, description: 'Order of milestone in course (1, 2, 3...)' })
    order: number
}