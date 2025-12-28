import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Types for YouTube API response
export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    duration?: number;  // Will be fetched separately if needed
}

interface YouTubeSearchItem {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
        channelTitle: string;
    };
}

interface YouTubeSearchResponse {
    items: YouTubeSearchItem[];
}

@Injectable()
export class YoutubeService {
    private apiKey: string;
    private baseUrl: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY') || '';
        this.baseUrl = this.configService.get<string>('YOUTUBE_API_BASE_URL') || ''
    }

    async searchVideos(query: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
        const url = `${this.baseUrl}/search?part=snippet&type=video&videoDuration=medium&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${this.apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const error = await response.text();
                console.error('YouTube API Error:', error);
                throw new Error('Failed to search YouTube videos');
            }

            const data: YouTubeSearchResponse = await response.json();

            return data.items.map((item) => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url ||
                    item.snippet.thumbnails.medium?.url ||
                    item.snippet.thumbnails.default?.url || '',
                channelTitle: item.snippet.channelTitle,
            }));
        } catch (error) {
            console.error('YouTube Search Error:', error);
            throw new Error('Failed to search YouTube videos');
        }
    }

    // Get video details including duration
    async getVideoDetails(videoId: string): Promise<{ duration: number }> {
        const url = `${this.baseUrl}/videos?part=contentDetails&id=${videoId}&key=${this.apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const duration = this.parseDuration(data.items[0].contentDetails.duration);
                return { duration };
            }

            return { duration: 0 };
        } catch (error) {
            console.error('YouTube Details Error:', error);
            return { duration: 0 };
        }
    }

    // Parse ISO 8601 duration (PT1H2M3S) to seconds
    private parseDuration(isoDuration: string): number {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;

        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');

        return hours * 3600 + minutes * 60 + seconds;
    }

    // Add video durations to the videos with duration == Null sending a batch of at max 50 videoIds at a time using yt api
    async getVideoDurations(videoIds: string[]): Promise<Map<string, number>> {
        // 1. Create empty results map
        const results = new Map<string, number>();

        // 2. If empty array of ids then return empty map
        if (videoIds.length === 0) return results;

        // 3. Chunk videos into batches of 50
        const chunks: typeof videoIds[] = []
        for (let i = 0; i < videoIds.length; i += 50) {
            chunks.push(videoIds.slice(i, i + 50))
        }

        // 4. Looping throuhg chunks, storing results
        for (let i = 0; i < chunks.length; i++) {

            // 4a. Convert each chunk to string of query param
            const idsString = chunks[i].join(',')

            // 4b. Forming the yt url using the query param
            const url = `${this.baseUrl}/videos?part=contentDetails&id=${idsString}&key=${this.apiKey}`;

            try {
                // 4c. Fetch from yt and converting into json response
                const response = await fetch(url)
                const data = await response.json()

                // 4d. Parse each item and add to Map
                for (const item of data.items) {
                    const duration = this.parseDuration(item.contentDetails.duration)
                    results.set(item.id, duration) // item.id is ytVideoId
                }
            } catch (error) {
                console.error(`YouTube in fetching duration for batch = ${i + 1} . \nError:`, error);
            }

        }

        return results
    }


}
