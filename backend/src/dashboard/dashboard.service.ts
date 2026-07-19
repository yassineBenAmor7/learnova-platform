import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboard(userId: number) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
            progress: true,
          },
        },
        quizAttempts: {
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalCourses = user.enrollments.length;
    const completedCourses = user.enrollments.filter(
      (e) => e.progress && e.progress.percentage === 100
    ).length;
    const totalQuizAttempts = user.quizAttempts.length;
    const passedQuizzes = user.quizAttempts.filter((q) => q.passed).length;
    const totalCertificates = user.certificates.length;

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      statistics: {
        totalCourses,
        completedCourses,
        totalQuizAttempts,
        passedQuizzes,
        totalCertificates,
      },
      recentCourses: user.enrollments.slice(0, 5).map((e) => ({
        id: e.course.id,
        title: e.course.title,
        progress: e.progress?.percentage || 0,
        lastAccess: e.progress?.lastAccess || e.enrolledAt,
      })),
      recentQuizAttempts: user.quizAttempts.slice(0, 5).map((q) => ({
        id: q.id,
        quizTitle: q.quiz.title,
        courseTitle: q.quiz.course.title,
        score: q.score,
        passed: q.passed,
        completedAt: q.finishedAt,
      })),
      certificates: user.certificates.map((c) => ({
        id: c.id,
        courseTitle: c.course.title,
        issuedAt: c.issuedAt,
        certificateNumber: c.certificateNumber,
        qrCode: c.qrCode,
      })),
    };
  }

  async getAdminDashboard() {
    const totalUsers = await this.prisma.client.user.count();
    const totalCourses = await this.prisma.client.course.count();
    const totalEnrollments = await this.prisma.client.enrollment.count();
    const totalQuizAttempts = await this.prisma.client.quizAttempt.count();
    const totalCertificates = await this.prisma.client.certificate.count();

    const recentUsers = await this.prisma.client.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentCourses = await this.prisma.client.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true,
      },
    });

    return {
      statistics: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalQuizAttempts,
        totalCertificates,
      },
      recentUsers,
      recentCourses,
    };
  }
}
