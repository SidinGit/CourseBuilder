import { Injectable } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MilestoneService {
  constructor(
    private prisma: PrismaService,
  ) { }

  create(createMilestoneDto: CreateMilestoneDto, courseId: string) {
      return this.prisma.milestone.create({
        data: {
          ...createMilestoneDto,
          courseId,
        }
      });
    }

  findAll(courseId: string) {
    return this.prisma.milestone.findMany({
      where: {
        courseId,
      }
    });
  }

  findOne(id: string) {
    return this.prisma.milestone.findUnique({
      where: {
        id,
      }
    });
  }

  update(id: string, updateMilestoneDto: UpdateMilestoneDto) {
      return this.prisma.milestone.update({
        where: {
          id,
        },
        data: updateMilestoneDto,
      });
    }

  remove(id: string) {
    return this.prisma.milestone.delete({
      where: {
        id,
      }
    });
  }
}
