import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { YoutubeService } from './youtube.service';
import { CourseGeneratorService } from './course-generator.service';
import { CourseModule } from '../course/course.module';
import { MilestoneModule } from '../milestone/milestone.module';
import { LessonModule } from '../lesson/lesson.module';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [
    ConfigModule,
    CourseModule,
    MilestoneModule,
    LessonModule,
    VideoModule,
  ],
  controllers: [AiController],
  providers: [AiService, YoutubeService, CourseGeneratorService],
  exports: [AiService, YoutubeService, CourseGeneratorService],
})
export class AiModule { }
