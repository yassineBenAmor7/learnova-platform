/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: any) {
    return this.prisma.client.user.create({
      data,
    });
  }

  async update(id: number, data: any) {
    const { currentPassword, newPassword, ...updateData } = data;

    if (updateData.email) {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Cet email est déjà utilisé par un autre compte');
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new BadRequestException('Le mot de passe actuel est requis pour changer de mot de passe');
      }

      const user = await this.prisma.client.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('Utilisateur introuvable');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Le mot de passe actuel est incorrect');
      }

      const BCRYPT_SALT_ROUNDS = 10;
      updateData.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getUserStatistics(userId: number) {
    const enrollments = await this.prisma.client.enrollment.findMany({
      where: { userId },
      include: {
        progress: true,
        course: true,
      },
    });

    const completedCourses = enrollments.filter(
      (e) => e.progress?.percentage === 100,
    ).length;

    const totalLearningTime = enrollments.reduce(
      (acc, e) => acc + (e.progress?.learningTimeSeconds || 0),
      0,
    );

    const quizAttempts = await this.prisma.client.quizAttempt.findMany({
      where: {
        userId,
      },
      include: {
        quiz: true,
      },
    });

    const passedQuizzes = quizAttempts.filter((a) => a.passed).length;

    const certificates = await this.prisma.client.certificate.findMany({
      where: { userId },
    });

    return {
      totalCourses: enrollments.length,
      completedCourses,
      totalHours: Math.floor(totalLearningTime / 3600),
      certificates: certificates.length,
      quizzesPassed: passedQuizzes,
      currentStreak: 0,
      totalPoints: 0,
      level: 1,
    };
  }

  async getUserActivity(userId: number, limit = 10) {
    const enrollments = await this.prisma.client.enrollment.findMany({
      where: { userId },
      include: {
        progress: true,
        course: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
      take: limit,
    });

    return enrollments.map((e) => ({
      type: 'course_enrollment',
      title: e.course.title,
      date: e.enrolledAt,
      progress: e.progress?.percentage || 0,
    }));
  }

  async getUserSettings(userId: number) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    };
  }

  async updateUserSettings(userId: number, settings: any) {
    return this.update(userId, settings);
  }

  async getUserNotifications(userId: number) {
    return {
      emailNotifications: true,
      courseUpdates: true,
      newBadges: true,
      weeklyProgress: true,
    };
  }

  async updateUserNotifications(userId: number, notifications: any) {
    return notifications;
  }

  async getUserPreferences(userId: number) {
    return {
      language: 'en',
      theme: 'light',
      timezone: 'UTC',
    };
  }

  async updateUserPreferences(userId: number, preferences: any) {
    return preferences;
  }

  async downloadUserData(userId: number) {
    const user = await this.findById(userId);
    const statistics = await this.getUserStatistics(userId);
    const activity = await this.getUserActivity(userId, 50);
    const preferences = await this.getUserPreferences(userId);
    const notifications = await this.getUserNotifications(userId);

    return {
      user,
      preferences,
      notifications,
      statistics,
      activity,
      exportDate: new Date().toISOString(),
    };
  }

  async deleteAccount(userId: number, password: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Mot de passe incorrect');
    }

    await this.prisma.client.user.delete({
      where: { id: userId },
    });

    return { message: 'Compte supprimé avec succès' };
  }
}
