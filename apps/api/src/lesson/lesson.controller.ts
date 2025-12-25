import { Controller, Get, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Lesson')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @Get()
  @ApiOperation({ summary: 'Get all lessons for a milestone' })
  @ApiQuery({ name: 'milestoneId', description: 'Milestone ID to get lessons for' })
  findAll(@Query('milestoneId') milestoneId: string) {
    return this.lessonService.findAll(milestoneId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
