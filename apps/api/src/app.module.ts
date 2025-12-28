import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { MilestoneModule } from './milestone/milestone.module';
import { LessonModule } from './lesson/lesson.module';
import { AiModule } from './ai/ai.module';
import { VideoModule } from './video/video.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    UserModule, 
    AuthModule, CourseModule, MilestoneModule, LessonModule, AiModule, VideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
