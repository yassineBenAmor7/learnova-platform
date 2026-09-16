import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getPublicOverview() {
    const totalCourses = await this.prisma.client.course.count();
    const totalEnrollments = await this.prisma.client.enrollment.count();
    const totalCertificates = await this.prisma.client.certificate.count();
    const totalUsers = await this.prisma.client.user.count();

    return {
      totalCourses,
      totalEnrollments,
      totalCertificates,
      totalUsers,
    };
  }

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
    const totalQuizzes = await this.prisma.client.quiz.count();

    console.log('Admin Dashboard Stats:', {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalQuizAttempts,
      totalCertificates,
      totalQuizzes,
    });

    // Active users: accessed a course in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await this.prisma.client.user.count({
      where: {
        enrollments: {
          some: {
            progress: {
              lastAccess: { gte: thirtyDaysAgo },
            },
          },
        },
      },
    });

    const revenueResult = await this.prisma.client.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });
    const revenue = revenueResult._sum.amount || 0;

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

    const recentCertificates = await this.prisma.client.certificate.findMany({
      take: 5,
      orderBy: { issuedAt: 'desc' },
      include: {
        user: true,
        course: true,
      },
    });

    const recentEnrollments = await this.prisma.client.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: true,
        course: true,
      },
    });

    // Combine all activities into a single timeline
    const activities = [
      ...recentUsers.map(user => ({
        type: 'user',
        id: user.id,
        message: `New user registered: ${user.firstName} ${user.lastName}`,
        timestamp: user.createdAt,
      })),
      ...recentCourses.map(course => ({
        type: 'course',
        id: course.id,
        message: `New course published: ${course.title}`,
        timestamp: course.createdAt,
      })),
      ...recentCertificates.map(cert => ({
        type: 'certificate',
        id: cert.id,
        message: `Certificate issued to ${cert.user.firstName} ${cert.user.lastName} for ${cert.course.title}`,
        timestamp: cert.issuedAt,
      })),
      ...recentEnrollments.map(enrollment => ({
        type: 'enrollment',
        id: enrollment.id,
        message: `${enrollment.user.firstName} ${enrollment.user.lastName} enrolled in ${enrollment.course.title}`,
        timestamp: enrollment.enrolledAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10);

    const result = {
      totalUsers,
      totalCourses,
      totalQuizzes,
      totalEnrollments,
      totalQuizAttempts,
      totalCertificates,
      activeUsers,
      revenue,
      recentActivity: activities,
    };

    console.log('Admin Dashboard Result:', result);
    return result;
  }

  async getAllData() {
    const users = await this.prisma.client.user.findMany({
      include: {
        enrollments: true,
        certificates: true,
        quizAttempts: true,
      },
    });

    const courses = await this.prisma.client.course.findMany({
      include: {
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
        enrollments: true,
      },
    });

    const enrollments = await this.prisma.client.enrollment.findMany({
      include: {
        user: true,
        course: true,
        progress: true,
      },
    });

    const certificates = await this.prisma.client.certificate.findMany({
      include: {
        user: true,
        course: true,
      },
    });

    const quizAttempts = await this.prisma.client.quizAttempt.findMany({
      include: {
        user: true,
        quiz: {
          include: {
            course: true,
          },
        },
      },
    });

    return {
      users,
      courses,
      enrollments,
      certificates,
      quizAttempts,
    };
  }
}
