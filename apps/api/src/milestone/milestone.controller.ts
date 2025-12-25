import { Controller, Get, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Milestone')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) { }

  @Get()
  @ApiOperation({ summary: 'Get all milestones for a course' })
  @ApiQuery({ name: 'courseId', description: 'Course ID to get milestones for' })
  findAll(@Query('courseId') courseId: string) {
    return this.milestoneService.findAll(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a milestone by ID' })
  @ApiParam({ name: 'id', description: 'Milestone ID' })
  findOne(@Param('id') id: string) {
    return this.milestoneService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a milestone' })
  @ApiParam({ name: 'id', description: 'Milestone ID' })
  remove(@Param('id') id: string) {
    return this.milestoneService.remove(id);
  }
}
