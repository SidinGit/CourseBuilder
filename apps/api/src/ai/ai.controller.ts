import { Controller, Get, Post, Body, Query, Request, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { YoutubeService } from './youtube.service';
import { CourseGeneratorService, GenerateCourseInput } from './course-generator.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// DTO for course generation
class GenerateCourseDto {
    title: string;
    numberOfMilestones?: number;
    videosPerMilestone?: number;
}

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly youtubeService: YoutubeService,
        private readonly courseGeneratorService: CourseGeneratorService,
    ) { }

    @Post('generate-course')
    @ApiOperation({ summary: 'Generate a complete course with AI' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Data Structures for interviews' },
                numberOfMilestones: { type: 'number', example: 3 },
                videosPerMilestone: { type: 'number', example: 3 },
            },
            required: ['title'],
        },
    })
    async generateCourse(
        @Body() body: GenerateCourseDto,
        @Request() req,
    ) {
        return this.courseGeneratorService.generateCourse(
            {
                title: body.title,
                numberOfMilestones: body.numberOfMilestones || 5,
                videosPerMilestone: body.videosPerMilestone || 3,
            },
            req.user.userId,
        );
    }

    @Get('generate')
    @ApiOperation({ summary: 'Test AI curriculum generation (no DB save)' })
    @ApiQuery({ name: 'title', description: 'Title for the course', example: 'Data Structures' })
    @ApiQuery({ name: 'milestones', description: 'Number of milestones', required: false, example: 5 })
    async testGenerate(
        @Query('title') title: string,
        @Query('milestones') milestones?: string,
    ) {
        const numMilestones = milestones ? parseInt(milestones) : 5;
        return this.aiService.generateCurriculum(title, numMilestones);
    }

    @Get('youtube-search')
    @ApiOperation({ summary: 'Test YouTube video search' })
    @ApiQuery({ name: 'query', description: 'Search query', example: 'javascript arrays tutorial' })
    @ApiQuery({ name: 'maxResults', description: 'Max results', required: false, example: 3 })
    async testYoutubeSearch(
        @Query('query') query: string,
        @Query('maxResults') maxResults?: string,
    ) {
        const max = maxResults ? parseInt(maxResults) : 3;
        return this.youtubeService.searchVideos(query, max);
    }
}
