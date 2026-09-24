import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RecommendedCourseItem {
  courseId: number;
  title: string;
  description: string;
  thumbnail: string | null;
  thumbnailUrl?: string | null;
  domain: string;
  category?: string;
  level: string;
  price: number;
  isPaid: boolean;
  matchScore: number;
  matchPercentage?: number;
  reason: string;
  primaryReason?: string;
  tags: string[];
  enrollmentCount: number;
}

export interface RecommendationResponse {
  userId?: number;
  recommendations: RecommendedCourseItem[];
  strategy: 'personalized_hybrid' | 'domain_affinity' | 'cold_start_popular';
  summary: string;
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getRecommendationsForUser(userId: number, limit: number = 6): Promise<RecommendationResponse> {
    // 1. Fetch user's enrollments, completions, and quiz attempts
    const userEnrollments = await this.prisma.client.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
        progress: true,
      },
    });

    const userQuizAttempts = await this.prisma.client.quizAttempt.findMany({
      where: { userId, passed: true },
      include: {
        quiz: {
          select: { courseId: true, passingScore: true },
        },
      },
      orderBy: { score: 'desc' },
    });

    const enrolledCourseIds = new Set(userEnrollments.map(e => e.courseId));

    // If user has no enrollments yet -> Cold Start Strategy
    if (userEnrollments.length === 0) {
      return this.getColdStartRecommendations(limit);
    }

    // 2. Build User Profile & Affinities
    const domainCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    let totalLearningTime = 0;

    for (const enr of userEnrollments) {
      const d = enr.course.domain;
      const l = enr.course.level;
      domainCounts[d] = (domainCounts[d] || 0) + 1;
      levelCounts[l] = (levelCounts[l] || 0) + 1;
      if (enr.progress) {
        totalLearningTime += enr.progress.learningTimeSeconds;
      }
    }

    // Sort user's top domains
    const topDomains = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const primaryDomain = topDomains[0];

    // Determine target level progression
    const hasCompletedBeginner = userEnrollments.some(
      e => e.course.level === 'BEGINNER' && (e.progress?.percentage ?? 0) >= 80,
    );
    const targetLevel = hasCompletedBeginner ? 'INTERMEDIATE' : 'BEGINNER';

    // 3. Fetch candidate courses not yet enrolled
    const candidateCourses = await this.prisma.client.course.findMany({
      where: {
        id: { notIn: Array.from(enrolledCourseIds) },
      },
      include: {
        enrollments: { select: { id: true } },
      },
    });

    if (candidateCourses.length === 0) {
      return this.getColdStartRecommendations(limit);
    }

    // 4. Score Candidate Courses
    const maxEnrollments = Math.max(
      1,
      ...candidateCourses.map(c => c.enrollments.length),
    );

    const scoredCourses = candidateCourses.map(course => {
      // Metric A: Domain Affinity (0 to 1)
      const domainWeight = (domainCounts[course.domain] || 0) / userEnrollments.length;
      const domainAffinity = Math.min(1, domainWeight * 1.5);

      // Metric B: Level Progression (0 to 1)
      let levelScore = 0.5;
      if (course.level === targetLevel) {
        levelScore = 1.0;
      } else if (course.level === 'ALL_LEVELS') {
        levelScore = 0.8;
      } else if (course.level === 'ADVANCED' && hasCompletedBeginner) {
        levelScore = 0.7;
      }

      // Metric C: Popularity factor (0 to 1)
      const popularity = course.enrollments.length / maxEnrollments;

      // Metric D: High Quiz Success in same domain bonus
      const domainQuizPass = userQuizAttempts.some(qa => {
        const matchingEnrollment = userEnrollments.find(e => e.courseId === qa.quiz.courseId);
        return matchingEnrollment && matchingEnrollment.course.domain === course.domain;
      });
      const masteryBonus = domainQuizPass ? 1.0 : 0.4;

      // Final Normalized Score: 40% Domain + 30% Level + 20% Popularity + 10% Mastery
      const compositeScore = (
        domainAffinity * 0.40 +
        levelScore * 0.30 +
        popularity * 0.20 +
        masteryBonus * 0.10
      );

      const matchScore = Math.min(99, Math.max(65, Math.round(compositeScore * 100)));

      // Generate context-aware pedagogical reason
      let reason = '';
      if (course.domain === primaryDomain && course.level === targetLevel) {
        reason = `Natural progression to ${course.level} level in your primary domain of interest (${course.domain.replace('_', ' ')}).`;
      } else if (course.domain === primaryDomain) {
        reason = `Highly recommended to deepen your skills in ${course.domain.replace('_', ' ')}.`;
      } else if (domainCounts[course.domain]) {
        reason = `Aligned with your recent learning interests (${course.domain.replace('_', ' ')}).`;
      } else {
        reason = `Popular and highly rated course on the Learnova platform.`;
      }

      const tags = [
        course.domain.replace('_', ' '),
        course.level,
        course.isPaid ? 'Certified Pro' : 'Free Access',
      ];

      return {
        courseId: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        thumbnailUrl: course.thumbnail,
        domain: course.domain,
        category: course.domain.replace(/_/g, ' '),
        level: course.level,
        price: course.price,
        isPaid: course.isPaid,
        matchScore,
        matchPercentage: matchScore,
        reason,
        primaryReason: reason,
        tags,
        enrollmentCount: course.enrollments.length,
      };
    });

    // Sort by match score descending
    scoredCourses.sort((a, b) => b.matchScore - a.matchScore);
    const topPicks = scoredCourses.slice(0, limit);

    return {
      userId,
      recommendations: topPicks,
      strategy: 'personalized_hybrid',
      summary: `Recommendations generated based on your ${userEnrollments.length} enrolled courses, affinity for ${primaryDomain ? primaryDomain.replace('_', ' ') : 'technologies'}, and current progression.`,
    };
  }

  async getColdStartRecommendations(limit: number = 6): Promise<RecommendationResponse> {
    // Pick the most popular, highly-recommended courses across distinct domains
    const courses = await this.prisma.client.course.findMany({
      where: {
        recommended: true,
      },
      include: {
        enrollments: { select: { id: true } },
      },
      take: limit * 2,
    });

    // Fallback if recommended flag isn't populated on enough courses
    const allCandidates = courses.length >= limit ? courses : await this.prisma.client.course.findMany({
      include: {
        enrollments: { select: { id: true } },
      },
      take: limit * 2,
    });

    // Diversify across domains
    const domainSeen = new Set<string>();
    const diversePicks: any[] = [];

    for (const c of allCandidates) {
      if (!domainSeen.has(c.domain)) {
        domainSeen.add(c.domain);
        diversePicks.push(c);
      }
      if (diversePicks.length >= limit) break;
    }

    if (diversePicks.length < limit) {
      for (const c of allCandidates) {
        if (!diversePicks.find(p => p.id === c.id)) {
          diversePicks.push(c);
        }
        if (diversePicks.length >= limit) break;
      }
    }

    const recommendations: RecommendedCourseItem[] = diversePicks.map((course, idx) => {
      const matchScore = 95 - idx * 2;
      const reason = `Flagship course recommended to start your learning path in ${course.domain.replace(/_/g, ' ')}.`;
      return {
        courseId: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        thumbnailUrl: course.thumbnail,
        domain: course.domain,
        category: course.domain.replace(/_/g, ' '),
        level: course.level,
        price: course.price,
        isPaid: course.isPaid,
        matchScore,
        matchPercentage: matchScore,
        reason,
        primaryReason: reason,
        tags: [course.domain.replace(/_/g, ' '), course.level, "Editor's Pick"],
        enrollmentCount: course.enrollments.length,
      };
    });

    return {
      recommendations,
      strategy: 'cold_start_popular',
      summary: `Curated selection of our most popular foundational courses to kickstart your learning.`,
    };
  }
}
