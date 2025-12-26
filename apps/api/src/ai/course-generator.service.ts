import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { YoutubeService } from './youtube.service';
import { CourseService } from '../course/course.service';
import { MilestoneService } from '../milestone/milestone.service';
import { LessonService } from '../lesson/lesson.service';

export interface GenerateCourseInput {
    title: string;
    numberOfMilestones?: number;
    videosPerMilestone?: number;
}

export interface GeneratedCourseResult {
    courseId: string;
    title: string;
    topic: string[];
    milestonesCreated: number;
    lessonsCreated: number;
}

@Injectable()
export class CourseGeneratorService {
    constructor(
        private aiService: AiService,
        private youtubeService: YoutubeService,
        private courseService: CourseService,
        private milestoneService: MilestoneService,
        private lessonService: LessonService,
    ) { }

    async generateCourse(
        input: GenerateCourseInput,
        userId: string,
    ): Promise<GeneratedCourseResult> {
        const { title, numberOfMilestones = 5, videosPerMilestone = 3 } = input;

        // Step 1: Generate curriculum using AI
        console.log('🤖 Generating curriculum with AI...');
        const curriculum = await this.aiService.generateCurriculum(title, numberOfMilestones);

        // Step 2: Create Course in database
        console.log('📚 Creating course in database...');
        const course = await this.courseService.create(
            {
                title: curriculum.title,
                description: curriculum.description,
                topic: curriculum.topic, // Store the original topic as array
            },
            userId,
        );

        let totalLessons = 0;

        // Step 3: Create Milestones and Lessons
        for (const milestoneData of curriculum.milestones) {
            console.log(`📌 Creating milestone: ${milestoneData.title}`);

            // Create Milestone
            const milestone = await this.milestoneService.create(
                {
                    title: milestoneData.title,
                    description: milestoneData.description,
                    order: milestoneData.order,
                },
                course.id,
            );

            // Step 4: Search YouTube for videos
            console.log(`🎬 Searching YouTube: ${milestoneData.youtubeSearchQuery}`);
            const videos = await this.youtubeService.searchVideos(
                milestoneData.youtubeSearchQuery,
                videosPerMilestone,
            );

            // Step 5: Create Lessons from YouTube results
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];

                await this.lessonService.create(
                    {
                        title: video.title,
                        videoId: video.videoId,
                        videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
                        thumbnail: video.thumbnail,
                        duration: 0, // Can be fetched separately if needed
                        order: i + 1,
                    },
                    milestone.id,
                );
                totalLessons++;
            }
        }

        console.log('✅ Course generation complete!');

        return {
            courseId: course.id,
            title: course.title,
            topic: course.topic,
            milestonesCreated: curriculum.milestones.length,
            lessonsCreated: totalLessons,
        };
    }
}
