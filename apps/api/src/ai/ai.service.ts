import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Type for generated curriculum - exported for use in controller
export interface GeneratedMilestone {
    title: string;
    description: string;
    order: number;
    youtubeSearchQuery: string;  // Query to find relevant videos
}

export interface GeneratedCurriculum {
    title: string;
    description: string;
    topic: string[];
    milestones: GeneratedMilestone[];
}

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateCurriculum(
        title: string,
        numberOfMilestones: number = 5,
    ): Promise<GeneratedCurriculum> {
        const prompt = `
      You are an educational curriculum designer. Create a structured learning curriculum for the topic: "${title}"
      
      Generate exactly ${numberOfMilestones} milestones (chapters/modules) for this course.
      
      For each milestone, provide:
      1. A clear, concise title
      2. A brief description (1-2 sentences)
      3. A YouTube search query that would find the best educational video for this milestone
      
      Also extract 3-5 relevant topic keywords from the user's request "${title}" to use as tags/categories.
      
      Return ONLY valid JSON in this exact format (no markdown, no code blocks):
      {
        "title": "Course title",
        "description": "Brief course description",
        "topic": ["keyword1", "keyword2", "keyword3"],
        "milestones": [
          {
            "title": "Milestone title",
            "description": "Milestone description",
            "order": 1,
            "youtubeSearchQuery": "search query for YouTube"
          }
        ]
      }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean the response (remove any markdown formatting if present)
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const curriculum: GeneratedCurriculum = JSON.parse(cleanedText);
            return curriculum;
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw new Error('Failed to generate curriculum');
        }
    }
}
