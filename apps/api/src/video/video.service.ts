import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(
    private prisma: PrismaService
  ){}
  async findOrCreate(createVideoDto: CreateVideoDto) {
    // 1. Check for an existing video first
    const ytVideoId = createVideoDto.ytVideoId
    const existingVideo = await this.prisma.video.findUnique({
      where: {
        ytVideoId
      }
    })

    // 2. If present then return or else create
    if(existingVideo) {
      return existingVideo;
    }

    // 3. Create a new video row and return it
    return this.prisma.video.create({
      data: {
        ...createVideoDto
      }
    });
  }

  findMissingDurations() {
    return this.prisma.video.findMany({
      where: {
        ytVideoDuration: null,
      }
    })
  }

  updateDuration(ytVideoId: string, duration: number) {
    return this.prisma.video.update({
      where: {
        ytVideoId,
      },
      data: {
        ytVideoDuration: duration,
      }
    })
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
