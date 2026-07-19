import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getUserPoints(userId: number) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            progress: true,
          },
        },
        quizAttempts: {
          where: { passed: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let totalPoints = 0;

    // Points for completed sessions (10 points per session)
    user.enrollments.forEach((enrollment) => {
      if (enrollment.progress) {
        totalPoints += enrollment.progress.completedSessions * 10;
      }
    });

    // Points for passed quizzes (50 points per quiz)
    totalPoints += user.quizAttempts.length * 50;

    return {
      userId,
      totalPoints,
      level: this.calculateLevel(totalPoints),
      pointsToNextLevel: this.calculatePointsToNextLevel(totalPoints),
    };
  }

  async getUserBadges(userId: number) {
    const points = await this.getUserPoints(userId);
    const badges = this.getBadgesForLevel(points.level);
    const streak = await this.getUserStreak(userId);

    return {
      userId,
      level: points.level,
      badges,
      streak,
    };
  }

  async awardPoints(userId: number, points: number, reason: string) {
    // In production, this would create a points history record
    return {
      userId,
      points,
      reason,
      newTotal: (await this.getUserPoints(userId)).totalPoints + points,
    };
  }

  async getUserStreak(userId: number) {
    const enrollments = await this.prisma.client.enrollment.findMany({
      where: { userId },
      include: {
        progress: true,
      },
    });

    if (enrollments.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate streak based on last access dates
    const lastAccessDates = enrollments
      .map((e) => e.progress?.lastAccess || e.enrolledAt)
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < lastAccessDates.length; i++) {
      const diffDays = Math.floor(
        (lastAccessDates[i - 1].getTime() - lastAccessDates[i].getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 1;
      }
    }

    return { currentStreak, longestStreak };
  }

  private calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
  }

  private calculatePointsToNextLevel(points: number): number {
    const level = this.calculateLevel(points);
    return level * 100 - points;
  }

  private getBadgesForLevel(level: number): string[] {
    const badges: string[] = [];
    if (level >= 1) badges.push('Beginner');
    if (level >= 5) badges.push('Intermediate');
    if (level >= 10) badges.push('Advanced');
    if (level >= 20) badges.push('Expert');
    if (level >= 50) badges.push('Master');
    return badges;
  }
}
