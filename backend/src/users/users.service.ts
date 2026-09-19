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
      const trimmedEmail = updateData.email.trim().toLowerCase();
      const currentUser = await this.prisma.client.user.findUnique({
        where: { id },
        include: { role: true },
      });
      const trustedLearnerRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
      const trustedAdminRegex = /^[a-zA-Z0-9._%+-]+@(learnova\.com|gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
      const isAdmin = currentUser?.role?.name === 'ADMIN' || currentUser?.roleId === 1;
      const isValidEmail = isAdmin
        ? trustedAdminRegex.test(trimmedEmail)
        : trustedLearnerRegex.test(trimmedEmail);

      if (!isValidEmail) {
        throw new BadRequestException(
          isAdmin
            ? 'Les administrateurs doivent utiliser une adresse officielle @learnova.com ou un fournisseur de confiance (Gmail, Outlook, Yahoo, iCloud)'
            : 'Seules les adresses email de confiance (Gmail, Outlook, Hotmail, Yahoo, iCloud) sont autorisées'
        );
      }
      updateData.email = trimmedEmail;

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
        quiz: {
          include: {
            course: true,
          },
        },
      },
    });

    // Count unique quizzes passed (not all attempts)
    const passedQuizzes = quizAttempts.filter((a) => a.passed);
    const uniquePassedQuizzes = new Set(passedQuizzes.map(a => a.quizId));

    const certificates = await this.prisma.client.certificate.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });

    const gamification = await this.prisma.client.userGamification.findUnique({
      where: { userId },
    });

    const getLevelMultiplier = (level?: string) => {
      switch (level) {
        case 'ADVANCED': return 2.0;
        case 'INTERMEDIATE': return 1.5;
        case 'ALL_LEVELS': return 1.25;
        case 'BEGINNER':
        default: return 1.0;
      }
    };

    const sessionPoints = enrollments.reduce((sum, e) => {
      const mult = getLevelMultiplier(e.course?.level);
      const completedSessions = e.progress?.completedSessions || 0;
      return sum + Math.round(completedSessions * 10 * mult);
    }, 0);

    const quizPoints = passedQuizzes.reduce((sum, a) => {
      const mult = getLevelMultiplier(a.quiz?.course?.level);
      return sum + Math.round(50 * mult);
    }, 0);

    const certPoints = certificates.reduce((sum, c) => {
      const mult = getLevelMultiplier(c.course?.level);
      return sum + Math.round(100 * mult);
    }, 0);

    const totalPoints = sessionPoints + quizPoints + certPoints;
    const level = Math.floor(totalPoints / 100) + 1;
    const currentStreak = gamification?.currentStreak || 0;

    return {
      totalCourses: enrollments.length,
      completedCourses,
      totalHours: Math.floor(totalLearningTime / 3600),
      certificates: certificates.length,
      quizzesPassed: uniquePassedQuizzes.size,
      currentStreak,
      totalPoints,
      level,
    };
  }

  async getUserActivity(userId: number, limit = 10) {
    const [enrollments, quizAttempts, certificates] = await Promise.all([
      this.prisma.client.enrollment.findMany({
        where: { userId },
        include: { course: true, progress: true },
        orderBy: { enrolledAt: 'desc' },
        take: limit,
      }),
      this.prisma.client.quizAttempt.findMany({
        where: { userId, passed: true },
        include: { quiz: true },
        orderBy: { finishedAt: 'desc' },
        take: limit,
      }),
      this.prisma.client.certificate.findMany({
        where: { userId },
        include: { course: true },
        orderBy: { issuedAt: 'desc' },
        take: limit,
      }),
    ]);

    const activities = [
      ...enrollments.map((e) => ({
        id: `enrollment-${e.id}`,
        type: 'course',
        title: `Enrolled in ${e.course?.title || 'Course'}`,
        date: e.enrolledAt,
        progress: e.progress?.percentage || 0,
      })),
      ...quizAttempts.map((q) => ({
        id: `quiz-${q.id}`,
        type: 'quiz',
        title: `Passed Quiz: ${q.quiz?.title || 'Assessment'} (${Math.round(q.score)}%)`,
        date: q.finishedAt || q.startedAt,
        progress: 100,
      })),
      ...certificates.map((c) => ({
        id: `cert-${c.id}`,
        type: 'certificate',
        title: `Earned Certificate: ${c.course?.title || 'Course Completion'}`,
        date: c.issuedAt,
        progress: 100,
      })),
    ];

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activities.slice(0, limit);
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

  async getAllUsers(limit = 50, offset = 0) {
    const users = await this.prisma.client.user.findMany({
      skip: offset,
      take: limit,
      include: {
        role: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.client.user.count();

    return {
      users: users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      total,
      limit,
      offset,
    };
  }

  async createUserByAdmin(createUserData: { firstName: string; lastName: string; email: string; password: string; roleId: number }) {
    const trimmedEmail = createUserData.email?.trim().toLowerCase();
    const isLearner = createUserData.roleId === 2;
    const trustedLearnerRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
    const trustedAdminRegex = /^[a-zA-Z0-9._%+-]+@(learnova\.com|gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
    const isValidEmail = isLearner
      ? trustedLearnerRegex.test(trimmedEmail)
      : trustedAdminRegex.test(trimmedEmail);

    if (!trimmedEmail || !isValidEmail) {
      throw new BadRequestException(
        isLearner
          ? 'Seules les adresses email de confiance (Gmail, Outlook, Hotmail, Yahoo, iCloud) sont autorisées pour les apprenants'
          : 'Les administrateurs doivent utiliser une adresse officielle @learnova.com ou un fournisseur de confiance (Gmail, Outlook, Yahoo, iCloud)'
      );
    }
    createUserData.email = trimmedEmail;

    // Check if email already exists
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: createUserData.email },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hash the password
    const BCRYPT_SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(createUserData.password, BCRYPT_SALT_ROUNDS);

    // Create the user
    const user = await this.prisma.client.user.create({
      data: {
        firstName: createUserData.firstName,
        lastName: createUserData.lastName,
        email: createUserData.email,
        password: hashedPassword,
        roleId: createUserData.roleId,
      },
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUserByAdmin(userId: number) {
    await this.prisma.client.user.delete({
      where: { id: userId },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  async updateUserRole(userId: number, roleId: number) {
    const user = await this.prisma.client.user.update({
      where: { id: userId },
      data: { roleId },
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserByAdmin(userId: number, updateData: { firstName?: string; lastName?: string; email?: string }) {
    if (updateData.email) {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Cet email est déjà utilisé par un autre compte');
      }
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    const user = await this.prisma.client.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
