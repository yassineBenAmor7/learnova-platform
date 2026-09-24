import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DomainPerformance {
  domain: string;
  domainLabel: string;
  quizzesTaken: number;
  quizzesPassed: number;
  averageScore: number;
  masteryStatus: 'EXCELLENT' | 'PROFICIENT' | 'NEEDS_ATTENTION' | 'NOT_STARTED';
}

export interface DetectedDifficulty {
  type: 'LOW_SCORE' | 'REPEAT_ATTEMPTS' | 'INCOMPLETE_COURSE' | 'STALLED_PROGRESS';
  courseId: number;
  courseTitle: string;
  quizTitle?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendedAction: string;
}

export interface PerformanceAnalysisReport {
  userId: number;
  userName: string;
  globalMasteryIndex: number;
  totalQuizzesTaken: number;
  totalQuizzesPassed: number;
  overallSuccessRate: number;
  learningTimeHours: number;
  currentStreakDays: number;
  retentionRisk: 'LOW' | 'MODERATE' | 'HIGH';
  retentionRiskReason: string;
  domainsAnalysis: DomainPerformance[];
  detectedDifficulties: DetectedDifficulty[];
  prescriptiveRecommendations: string[];
  generatedAt: Date;
}

@Injectable()
export class PerformanceAnalysisService {
  private readonly logger = new Logger(PerformanceAnalysisService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async analyzeUserPerformance(userId: number): Promise<PerformanceAnalysisReport> {
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
                course: { select: { id: true, title: true, domain: true } },
                session: { select: { id: true, title: true } },
              },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
        gamification: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const totalQuizzesTaken = user.quizAttempts.length;
    const passedAttempts = user.quizAttempts.filter(a => a.passed);
    const totalQuizzesPassed = passedAttempts.length;
    const overallSuccessRate = totalQuizzesTaken > 0
      ? Math.round((totalQuizzesPassed / totalQuizzesTaken) * 100)
      : 0;

    let totalScoreSum = 0;
    for (const att of user.quizAttempts) {
      totalScoreSum += att.score;
    }
    const globalMasteryIndex = totalQuizzesTaken > 0
      ? Math.round(totalScoreSum / totalQuizzesTaken)
      : 0;

    let totalSeconds = 0;
    for (const enr of user.enrollments) {
      if (enr.progress) {
        totalSeconds += enr.progress.learningTimeSeconds;
      }
    }
    const learningTimeHours = parseFloat((totalSeconds / 3600).toFixed(1));
    const currentStreakDays = user.gamification?.currentStreak || 0;

    // 1. Analyze by Domain
    const domainStats: Record<string, { total: number; passed: number; scoreSum: number }> = {};

    for (const att of user.quizAttempts) {
      const domain = att.quiz.course.domain;
      if (!domainStats[domain]) {
        domainStats[domain] = { total: 0, passed: 0, scoreSum: 0 };
      }
      domainStats[domain].total++;
      if (att.passed) domainStats[domain].passed++;
      domainStats[domain].scoreSum += att.score;
    }

    const domainsAnalysis: DomainPerformance[] = Object.entries(domainStats).map(([domain, stats]) => {
      const avg = Math.round(stats.scoreSum / stats.total);
      let status: 'EXCELLENT' | 'PROFICIENT' | 'NEEDS_ATTENTION' | 'NOT_STARTED' = 'NOT_STARTED';
      if (avg >= 85) status = 'EXCELLENT';
      else if (avg >= 70) status = 'PROFICIENT';
      else status = 'NEEDS_ATTENTION';

      return {
        domain,
        domainLabel: domain.replace(/_/g, ' '),
        quizzesTaken: stats.total,
        quizzesPassed: stats.passed,
        averageScore: avg,
        masteryStatus: status,
      };
    });

    // 2. Detect Specific Difficulties
    const detectedDifficulties: DetectedDifficulty[] = [];

    // Check failed quiz attempts
    const failedAttempts = user.quizAttempts.filter(a => !a.passed);
    for (const failed of failedAttempts.slice(0, 3)) {
      detectedDifficulties.push({
        type: 'LOW_SCORE',
        courseId: failed.quiz.course.id,
        courseTitle: failed.quiz.course.title,
        quizTitle: failed.quiz.title,
        severity: failed.score < 50 ? 'HIGH' : 'MEDIUM',
        description: `Insufficient score (${Math.round(failed.score)}% scored vs 70% required) on assessment "${failed.quiz.title}".`,
        recommendedAction: `Carefully review the course study notes for "${failed.quiz.course.title}" before retrying the quiz.`,
      });
    }

    // Check stalled courses (progress < 30% while enrolled for some time)
    for (const enr of user.enrollments) {
      const p = enr.progress?.percentage || 0;
      if (p > 0 && p < 40) {
        detectedDifficulties.push({
          type: 'STALLED_PROGRESS',
          courseId: enr.course.id,
          courseTitle: enr.course.title,
          severity: 'LOW',
          description: `Progress stalled at ${Math.round(p)}% on "${enr.course.title}".`,
          recommendedAction: `Schedule a 20-minute session to reach the next milestone.`,
        });
      }
    }

    // 3. Retention / Dropout Risk Analysis
    let retentionRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    let retentionRiskReason = 'Regular activity and satisfactory engagement on the platform.';

    const lastActivity = user.gamification?.lastActivityDate;
    const now = new Date();
    const daysSinceActivity = lastActivity
      ? Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    if (daysSinceActivity > 14 || (totalQuizzesTaken > 0 && overallSuccessRate < 40)) {
      retentionRisk = 'HIGH';
      retentionRiskReason = `No activity recorded for ${daysSinceActivity} days and notable assessment failure rate.`;
    } else if (daysSinceActivity > 5 || currentStreakDays === 0) {
      retentionRisk = 'MODERATE';
      retentionRiskReason = `Slowing study pace. Risk of breaking daily learning streak.`;
    }

    // 4. Prescriptive AI Recommendations
    const prescriptiveRecommendations: string[] = [];

    if (overallSuccessRate >= 80) {
      prescriptiveRecommendations.push(
        'Your performance demonstrates strong conceptual mastery. You are ready to tackle the 40-question Final Certification Exams directly.',
      );
    } else if (overallSuccessRate >= 70) {
      prescriptiveRecommendations.push(
        'You consistently pass the 70% benchmark. To maximize your score, review real-world case studies and methodology sections.',
      );
    } else if (totalQuizzesTaken > 0) {
      prescriptiveRecommendations.push(
        'Some concepts require consolidation. Take time to read the study notes under each video before starting a quiz attempt.',
      );
    } else {
      prescriptiveRecommendations.push(
        'Welcome to Learnova! Complete your first session and validate your learning with the 3-question practice quiz.',
      );
    }

    if (currentStreakDays >= 3) {
      prescriptiveRecommendations.push(
        `Great consistency with a ${currentStreakDays}-day learning streak! Keep it up to unlock the Streak Guardian badge.`,
      );
    } else {
      prescriptiveRecommendations.push(
        'Studying 15 minutes each day significantly enhances long-term retention and unlocks experience points faster.',
      );
    }

    return {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`.trim(),
      globalMasteryIndex,
      totalQuizzesTaken,
      totalQuizzesPassed,
      overallSuccessRate,
      learningTimeHours,
      currentStreakDays,
      retentionRisk,
      retentionRiskReason,
      domainsAnalysis,
      detectedDifficulties: detectedDifficulties.slice(0, 5),
      prescriptiveRecommendations,
      generatedAt: new Date(),
    };
  }
}
