import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.client.course.create({
      data: createCourseDto,
      include: {
        creator: true,
      },
    });
  }

  async findAll() {
    return this.prisma.client.course.findMany({
      include: {
        creator: true,
        sessions: true,
        quizzes: true,
      },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
      include: {
        creator: true,
        sessions: {
          include: {
            videos: true,
          },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.prisma.client.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        creator: true,
      },
    });
  }

  async remove(id: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.prisma.client.course.delete({
      where: { id },
    });
  }
}
