import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { YoutubeService } from './youtube.service';
import { CourseService } from '../course/course.service';
import { MilestoneService } from '../milestone/milestone.service';
import { LessonService } from '../lesson/lesson.service';
import { VideoService } from 'src/video/video.service';

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
        private videoService: VideoService,
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
        const usedVideoIds = new Set<string>()
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
                videosPerMilestone + 1,
            );

            // Step 5: Create Lessons from YouTube results
            let lessonCount = 0
            for (let i = 0; i < videos.length && lessonCount < videosPerMilestone; i++) {
                const video = videos[i];

                if (usedVideoIds.has(video.videoId)) {
                    continue;
                }

                usedVideoIds.add(video.videoId)

                // step 5a: Create or find the video record
                const videoRecord = await this.videoService.findOrCreate({
                    ytVideoTitle: video.title,
                    ytVideoId: video.videoId,
                    ytVideoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
                    ytVideoThumbnail: video.thumbnail,
                    ytVideoTags: [],  // YouTube search doesn't give tags
                })

                // step 5b: Create lesson with videoId and order

                await this.lessonService.create(
                    {
                        videoId: videoRecord.id,
                        order: lessonCount + 1,
                    },
                    milestone.id,
                );

                lessonCount++;
                totalLessons++;
            }
        }

        console.log('✅ Course generation complete!');

        // 6. Background: Fetch durations for videos missing them
        const videosWithoutDuration = await this.videoService.findMissingDurations();

        const ytVideoIds = videosWithoutDuration.map(v => v.ytVideoId);

        const durationMap = await this.youtubeService.getVideoDurations(ytVideoIds)

        const updates = Array.from(durationMap, ([ytVideoId, duration]) =>
            this.videoService.updateDuration(ytVideoId, duration)
        );

        await Promise.all(updates);

        return {
            courseId: course.id,
            title: course.title,
            topic: course.topic,
            milestonesCreated: curriculum.milestones.length,
            lessonsCreated: totalLessons,
        };
    }
}
