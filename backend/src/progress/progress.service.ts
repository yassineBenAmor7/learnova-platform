import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createProgressDto: CreateProgressDto) {
    return this.prisma.client.progress.create({
      data: createProgressDto,
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.client.progress.findMany({
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.client.progress.findMany({
      where: {
        enrollment: {
          userId,
        },
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async findByCourse(userId: number, courseId: number) {
    return this.prisma.client.progress.findMany({
      where: {
        enrollment: {
          userId,
          courseId,
        },
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const progress = await this.prisma.client.progress.findUnique({
      where: { id },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    return progress;
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    const progress = await this.prisma.client.progress.findUnique({
      where: { id },
    });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    return this.prisma.client.progress.update({
      where: { id },
      data: updateProgressDto,
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const progress = await this.prisma.client.progress.findUnique({
      where: { id },
    });

    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    return this.prisma.client.progress.delete({
      where: { id },
    });
  }

  async calculateCourseProgress(userId: number, courseId: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
      include: {
        sessions: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const totalSessions = course.sessions.length;
    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        progress: true,
      },
    });

    if (!enrollment || !enrollment.progress) {
      return {
        courseId,
        totalSessions,
        completedSessions: 0,
        progressPercentage: 0,
        isCompleted: false,
      };
    }

    const completedSessions = enrollment.progress.completedSessions;
    const progressPercentage = enrollment.progress.percentage;

    return {
      courseId,
      totalSessions,
      completedSessions,
      progressPercentage,
      isCompleted: progressPercentage === 100,
    };
  }

  async updateProgress(enrollmentId: number, completedSessions: number, completedVideos: number) {
    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            sessions: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${enrollmentId} not found`);
    }

    const totalSessions = enrollment.course.sessions.length;
    const percentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    return this.prisma.client.progress.upsert({
      where: { enrollmentId },
      create: {
        enrollmentId,
        completedSessions,
        completedVideos,
        percentage,
        lastAccess: new Date(),
      },
      update: {
        completedSessions,
        completedVideos,
        percentage,
        lastAccess: new Date(),
      },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });
  }
}
