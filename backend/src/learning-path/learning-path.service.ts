import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class LearningPathService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  async getCoursePath(userId: number, courseId: number) {
    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        progress: true,
        course: {
          include: {
            sessions: {
              orderBy: { orderNumber: 'asc' },
              include: {
                videos: { orderBy: { orderNumber: 'asc' } },
              },
            },
            quizzes: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('You must enroll in this course first');
    }

    const completions = await this.prisma.client.sessionCompletion.findMany({
      where: { userId, sessionId: { in: enrollment.course.sessions.map((s) => s.id) } },
    });

    const completedSessionIds = new Set(completions.map((c) => c.sessionId));
    const sessions = enrollment.course.sessions.map((session, index) => {
      const isCompleted = completedSessionIds.has(session.id);
      const previousCompleted =
        index === 0 || completedSessionIds.has(enrollment.course.sessions[index - 1].id);

      return {
        ...session,
        isCompleted,
        isLocked: !previousCompleted && index > 0,
        canAccess: index === 0 || previousCompleted,
      };
    });

    const allSessionsCompleted =
      sessions.length > 0 && sessions.every((s) => s.isCompleted);

    return {
      enrollment,
      sessions,
      quizUnlocked: allSessionsCompleted,
      quizzes: enrollment.course.quizzes,
    };
  }

  async completeSession(userId: number, sessionId: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id: sessionId },
      include: { course: { include: { sessions: { orderBy: { orderNumber: 'asc' } } } } },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: session.courseId } },
      include: { progress: true },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must enroll in this course first');
    }

    const sessionIndex = session.course.sessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex > 0) {
      const previousSession = session.course.sessions[sessionIndex - 1];
      const previousDone = await this.prisma.client.sessionCompletion.findUnique({
        where: { userId_sessionId: { userId, sessionId: previousSession.id } },
      });
      if (!previousDone) {
        throw new ForbiddenException('Complete the previous session first');
      }
    }

    await this.prisma.client.sessionCompletion.upsert({
      where: { userId_sessionId: { userId, sessionId } },
      create: { userId, sessionId },
      update: { completedAt: new Date() },
    });

    const completedCount = await this.prisma.client.sessionCompletion.count({
      where: {
        userId,
        sessionId: { in: session.course.sessions.map((s) => s.id) },
      },
    });

    const totalSessions = session.course.sessions.length;
    const percentage = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;

    await this.prisma.client.progress.update({
      where: { enrollmentId: enrollment.id },
      data: {
        completedSessions: completedCount,
        percentage,
        lastAccess: new Date(),
      },
    });

    await this.gamificationService.addPoints(userId, 10, 'session_completed');

    return { message: 'Session completed', completedSessions: completedCount, percentage };
  }

  async trackVideoWatch(
    userId: number,
    videoId: number,
    watchedSeconds: number,
    completed: boolean,
  ) {
    const video = await this.prisma.client.video.findUnique({
      where: { id: videoId },
      include: { session: true },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }

    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: video.session.courseId } },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must enroll in this course first');
    }

    const watch = await this.prisma.client.videoWatch.upsert({
      where: { userId_videoId: { userId, videoId } },
      create: { userId, videoId, watchedSeconds, completed },
      update: { watchedSeconds, completed, lastWatchedAt: new Date() },
    });

    if (completed) {
      const completedVideos = await this.prisma.client.videoWatch.count({
        where: { userId, completed: true, video: { session: { courseId: video.session.courseId } } },
      });

      await this.prisma.client.progress.update({
        where: { enrollmentId: enrollment.id },
        data: {
          completedVideos,
          learningTimeSeconds: { increment: Math.min(watchedSeconds, 60) },
          lastAccess: new Date(),
        },
      });

      await this.gamificationService.addPoints(userId, 5, 'video_completed');
      await this.gamificationService.updateStreak(userId);
    }

    return watch;
  }
}
