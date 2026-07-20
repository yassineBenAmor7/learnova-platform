import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: number, courseId: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const existing = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    return this.prisma.client.enrollment.create({
      data: {
        userId,
        courseId,
        progress: {
          create: {},
        },
      },
      include: {
        course: true,
        progress: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.client.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            sessions: { orderBy: { orderNumber: 'asc' } },
            quizzes: true,
          },
        },
        progress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findOne(userId: number, courseId: number) {
    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: true,
        progress: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }
}
