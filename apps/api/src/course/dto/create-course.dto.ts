import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateCourseDto {

    @ApiProperty({ example: 'DSA and Algorithms intermediate', description: 'Video Title' })

    title: string


    @ApiPropertyOptional({ example: 'A curated set of videos to grasp the intermediate level concepts of Data Structures and Algorithm', description: 'Course Description' })

    description?: string


    @ApiProperty({ example: ['DSA', 'C++', 'Algorithms'], description: 'Course topics/tags' })

    topic: string[]
}
