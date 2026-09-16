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
            course: true,
          },
        },
        quizAttempts: {
          where: { passed: true },
          include: {
            quiz: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const getLevelMultiplier = (level?: string) => {
      switch (level) {
        case 'ADVANCED': return 2.0;
        case 'INTERMEDIATE': return 1.5;
        case 'ALL_LEVELS': return 1.25;
        case 'BEGINNER':
        default: return 1.0;
      }
    };

    let totalPoints = 0;

    user.enrollments.forEach((enrollment) => {
      if (enrollment.progress) {
        const mult = getLevelMultiplier(enrollment.course?.level);
        totalPoints += Math.round(enrollment.progress.completedSessions * 10 * mult);
      }
    });

    // Professional gamification: XP only for first successful completion of each quiz
    // Type Coursera/Udemy - no XP for quiz repetitions
    const passedQuizzesByQuizId = new Map<number, any>();
    user.quizAttempts.forEach((attempt) => {
      if (attempt.quizId && !passedQuizzesByQuizId.has(attempt.quizId)) {
        passedQuizzesByQuizId.set(attempt.quizId, attempt);
      }
    });

    passedQuizzesByQuizId.forEach((attempt) => {
      const mult = getLevelMultiplier(attempt.quiz?.course?.level);
      totalPoints += Math.round(50 * mult);
    });

    console.log(`User ${userId} points calculation:`, {
      enrollments: user.enrollments.length,
      completedSessions: user.enrollments.reduce((sum, e) => sum + (e.progress?.completedSessions || 0), 0),
      passedQuizzes: user.quizAttempts.length,
      totalPoints,
      level: this.calculateLevel(totalPoints),
    });

    return {
      userId,
      totalPoints,
      level: this.calculateLevel(totalPoints),
      pointsToNextLevel: this.calculatePointsToNextLevel(totalPoints),
    };
  }

  async getUserBadges(userId: number) {
    const points = await this.getUserPoints(userId);
    const streak = await this.getUserStreak(userId);

    // Check user enrollments
    const enrollments = await this.prisma.client.enrollment.findMany({
      where: { userId },
      include: { 
        progress: true,
        course: true,
      },
    });

    const hasFirstEnrollment = enrollments.length > 0;
    const hasFirstSession = enrollments.some(e => e.progress && e.progress.completedSessions > 0);

    // Calculate completed courses count
    const completedCoursesCount = enrollments.filter(
      e => e.progress && e.progress.percentage === 100
    ).length;

    // Calculate total learning hours
    const totalLearningTimeSeconds = enrollments.reduce(
      (acc, e) => acc + (e.progress?.learningTimeSeconds || 0),
      0
    );
    const totalHoursLearned = Math.floor(totalLearningTimeSeconds / 3600);

    // Calculate domains learned
    const domainsLearned = new Set(
      enrollments
        .filter(e => e.progress && e.progress.completedSessions > 0)
        .map(e => e.course.domain)
    );

    // Check user certificates
    const certificates = await this.prisma.client.certificate.findMany({
      where: { userId },
    });

    const hasFirstCertificate = certificates.length > 0;
    const hasGraduated = certificates.length > 0;

    // Check user quiz attempts
    const quizAttempts = await this.prisma.client.quizAttempt.findMany({
      where: { userId },
      include: { 
        answers: true,
        quiz: {
          include: {
            course: true,
          },
        },
      },
    });

    const hasFirstQuiz = quizAttempts.length > 0;
    const totalQuizzesPassed = quizAttempts.filter(q => q.passed).length;

    // Check for perfect quiz scores (100%)
    const hasPerfectQuiz = quizAttempts.some(attempt => {
      if (attempt.score === 100) return true;
      if (attempt.answers && attempt.answers.length > 0) {
        return attempt.answers.every(a => a.isCorrect === true);
      }
      return false;
    });

    // Check streak milestones
    const hasStreak3 = (streak?.currentStreak || 0) >= 3 || (streak?.longestStreak || 0) >= 3;
    const hasStreak7 = (streak?.currentStreak || 0) >= 7 || (streak?.longestStreak || 0) >= 7;
    const hasStreak30 = (streak?.currentStreak || 0) >= 30 || (streak?.longestStreak || 0) >= 30;

    const badges = this.getBadgesForLevel(points.level, {
      hasGraduated,
      hasPerfectQuiz,
      hasStreak3,
      hasStreak7,
      hasStreak30,
      hasFirstEnrollment,
      hasFirstSession,
      hasFirstQuiz,
      hasFirstCertificate,
      completedCoursesCount,
      totalQuizzesPassed,
      totalHoursLearned,
      domainsLearned,
    }, points.totalPoints);

    return {
      userId,
      level: points.level,
      badges,
      streak,
      totalPoints: points.totalPoints,
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

  async addPoints(userId: number, points: number, reason: string) {
    return this.awardPoints(userId, points, reason);
  }

  async updateStreak(userId: number) {
    const gamification = await this.prisma.client.userGamification.findUnique({
      where: { userId },
    });

    if (!gamification) {
      await this.prisma.client.userGamification.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date(),
        },
      });
      return { currentStreak: 1, longestStreak: 1 };
    }

    const today = new Date();
    const lastActivity = gamification.lastActivityDate || new Date(0);
    const diffDays = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newCurrentStreak = gamification.currentStreak;
    let newLongestStreak = gamification.longestStreak;

    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Consecutive day
      newCurrentStreak++;
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else {
      // Streak broken
      newCurrentStreak = 1;
    }

    await this.prisma.client.userGamification.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      },
    });

    return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak };
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

  private getBadgesForLevel(level: number, milestones?: { 
    hasGraduated?: boolean; 
    hasPerfectQuiz?: boolean; 
    hasStreak3?: boolean; 
    hasStreak7?: boolean;
    hasStreak30?: boolean;
    hasFirstEnrollment?: boolean; 
    hasFirstSession?: boolean; 
    hasFirstQuiz?: boolean;
    hasFirstCertificate?: boolean;
    completedCoursesCount?: number;
    totalQuizzesPassed?: number;
    totalHoursLearned?: number;
    domainsLearned?: Set<string>;
  }, totalPoints?: number): Array<{ id: string; name: string; description: string; iconUrl: string; tier: string; unlocked: boolean; category: string }> {
    const hasGraduated = milestones?.hasGraduated ?? false;
    const hasPerfectQuiz = milestones?.hasPerfectQuiz ?? false;
    const hasStreak3 = milestones?.hasStreak3 ?? false;
    const hasStreak7 = milestones?.hasStreak7 ?? false;
    const hasStreak30 = milestones?.hasStreak30 ?? false;
    const hasFirstEnrollment = milestones?.hasFirstEnrollment ?? false;
    const hasFirstSession = milestones?.hasFirstSession ?? false;
    const hasFirstQuiz = milestones?.hasFirstQuiz ?? false;
    const hasFirstCertificate = milestones?.hasFirstCertificate ?? false;
    const completedCoursesCount = milestones?.completedCoursesCount ?? 0;
    const totalQuizzesPassed = milestones?.totalQuizzesPassed ?? 0;
    const totalHoursLearned = milestones?.totalHoursLearned ?? 0;
    const domainsLearned = milestones?.domainsLearned ?? new Set();

    const allBadges = [
      // === ONBOARDING BADGES ===
      {
        id: 'first_steps',
        name: 'Getting Started',
        description: 'Enrolled in your first course',
        iconUrl: '/badges/first_steps.svg',
        tier: 'Bronze',
        category: 'onboarding',
        milestone: 'first_enrollment',
      },
      {
        id: 'first_session',
        name: 'First Lesson',
        description: 'Completed your first learning session',
        iconUrl: '/badges/first_session.svg',
        tier: 'Bronze',
        category: 'onboarding',
        milestone: 'first_session',
      },
      {
        id: 'first_quiz',
        name: 'Quiz Explorer',
        description: 'Attempted your first quiz',
        iconUrl: '/badges/first_quiz.svg',
        tier: 'Bronze',
        category: 'onboarding',
        milestone: 'first_quiz',
      },
      {
        id: 'first_certificate',
        name: 'First Achievement',
        description: 'Earned your first course certificate',
        iconUrl: '/badges/first_certificate.svg',
        tier: 'Silver',
        category: 'onboarding',
        milestone: 'first_certificate',
      },

      // === PROGRESSION BADGES ===
      {
        id: 'bronze_learner',
        name: 'Bronze Learner',
        description: 'Completed 1 course (Level 1+)',
        iconUrl: '/badges/bronze_learner.svg',
        tier: 'Bronze',
        category: 'progression',
        minCourses: 1,
        milestone: 'courses_completed',
      },
      {
        id: 'silver_learner',
        name: 'Silver Learner',
        description: 'Completed 3 courses (Level 3+)',
        iconUrl: '/badges/silver_learner.svg',
        tier: 'Silver',
        category: 'progression',
        minCourses: 3,
        milestone: 'courses_completed',
      },
      {
        id: 'gold_learner',
        name: 'Gold Learner',
        description: 'Completed 5 courses (Level 5+)',
        iconUrl: '/badges/gold_learner.svg',
        tier: 'Gold',
        category: 'progression',
        minCourses: 5,
        milestone: 'courses_completed',
      },
      {
        id: 'platinum_learner',
        name: 'Platinum Learner',
        description: 'Completed 10 courses (Level 10+)',
        iconUrl: '/badges/platinum_learner.svg',
        tier: 'Platinum',
        category: 'progression',
        minCourses: 10,
        milestone: 'courses_completed',
      },
      {
        id: 'diamond_master',
        name: 'Diamond Master',
        description: 'Completed 25+ courses (Elite Level)',
        iconUrl: '/badges/diamond_master.svg',
        tier: 'Diamond',
        category: 'progression',
        minCourses: 25,
        milestone: 'courses_completed',
      },

      // === XP/LEVEL BADGES ===
      {
        id: 'level_5',
        name: 'Rising Star',
        description: 'Reached Level 5',
        iconUrl: '/badges/level_5.svg',
        tier: 'Silver',
        category: 'level',
        minLevel: 5,
        milestone: 'level',
      },
      {
        id: 'level_10',
        name: 'Knowledge Seeker',
        description: 'Reached Level 10',
        iconUrl: '/badges/level_10.svg',
        tier: 'Gold',
        category: 'level',
        minLevel: 10,
        milestone: 'level',
      },
      {
        id: 'level_25',
        name: 'Expert Learner',
        description: 'Reached Level 25',
        iconUrl: '/badges/level_25.svg',
        tier: 'Platinum',
        category: 'level',
        minLevel: 25,
        milestone: 'level',
      },
      {
        id: 'level_50',
        name: 'Grandmaster',
        description: 'Reached Level 50',
        iconUrl: '/badges/level_50.svg',
        tier: 'Diamond',
        category: 'level',
        minLevel: 50,
        milestone: 'level',
      },

      // === QUIZ MASTERY BADGES ===
      {
        id: 'quiz_ace',
        name: 'Quiz Ace',
        description: 'Scored 100% on a quiz',
        iconUrl: '/badges/quiz_ace.svg',
        tier: 'Silver',
        category: 'quiz',
        milestone: 'perfect_quiz',
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Passed 10 quizzes with 80%+ average',
        iconUrl: '/badges/quiz_master.svg',
        tier: 'Gold',
        category: 'quiz',
        minQuizzes: 10,
        milestone: 'quiz_count',
      },
      {
        id: 'quiz_legend',
        name: 'Quiz Legend',
        description: 'Passed 50 quizzes',
        iconUrl: '/badges/quiz_legend.svg',
        tier: 'Platinum',
        category: 'quiz',
        minQuizzes: 50,
        milestone: 'quiz_count',
      },

      // === LEARNING TIME BADGES ===
      {
        id: 'hour_10',
        name: 'Dedicated Learner',
        description: 'Completed 10 hours of learning',
        iconUrl: '/badges/hour_10.svg',
        tier: 'Bronze',
        category: 'time',
        minHours: 10,
        milestone: 'learning_hours',
      },
      {
        id: 'hour_50',
        name: 'Committed Scholar',
        description: 'Completed 50 hours of learning',
        iconUrl: '/badges/hour_50.svg',
        tier: 'Silver',
        category: 'time',
        minHours: 50,
        milestone: 'learning_hours',
      },
      {
        id: 'hour_100',
        name: 'Knowledge Champion',
        description: 'Completed 100 hours of learning',
        iconUrl: '/badges/hour_100.svg',
        tier: 'Gold',
        category: 'time',
        minHours: 100,
        milestone: 'learning_hours',
      },
      {
        id: 'hour_500',
        name: 'Learning Virtuoso',
        description: 'Completed 500 hours of learning',
        iconUrl: '/badges/hour_500.svg',
        tier: 'Platinum',
        category: 'time',
        minHours: 500,
        milestone: 'learning_hours',
      },

      // === STREAK BADGES ===
      {
        id: 'streak_3',
        name: '3-Day Streak',
        description: 'Maintained a 3-day learning streak',
        iconUrl: '/badges/streak_3.svg',
        tier: 'Bronze',
        category: 'streak',
        milestone: 'streak_3',
      },
      {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        iconUrl: '/badges/streak_7.svg',
        tier: 'Silver',
        category: 'streak',
        milestone: 'streak_7',
      },
      {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Maintained a 30-day learning streak',
        iconUrl: '/badges/streak_30.svg',
        tier: 'Gold',
        category: 'streak',
        milestone: 'streak_30',
      },

      // === SPECIALIZATION BADGES ===
      {
        id: 'polyglot',
        name: 'Polyglot',
        description: 'Learned in 3+ different domains',
        iconUrl: '/badges/polyglot.svg',
        tier: 'Silver',
        category: 'specialization',
        minDomains: 3,
        milestone: 'domains_learned',
      },
      {
        id: 'renaissance',
        name: 'Renaissance Scholar',
        description: 'Learned in 5+ different domains',
        iconUrl: '/badges/renaissance.svg',
        tier: 'Gold',
        category: 'specialization',
        minDomains: 5,
        milestone: 'domains_learned',
      },
      {
        id: 'polymath',
        name: 'Polymath',
        description: 'Learned in 8+ different domains',
        iconUrl: '/badges/polymath.svg',
        tier: 'Platinum',
        category: 'specialization',
        minDomains: 8,
        milestone: 'domains_learned',
      },

      // === EXCELLENCE BADGES ===
      {
        id: 'fast_learner',
        name: 'Fast Learner',
        description: 'Completed a course in under 24 hours',
        iconUrl: '/badges/fast_learner.svg',
        tier: 'Silver',
        category: 'excellence',
        milestone: 'fast_completion',
      },
      {
        id: 'perfect_student',
        name: 'Perfect Student',
        description: 'Completed 3 courses with 100% quiz scores',
        iconUrl: '/badges/perfect_student.svg',
        tier: 'Gold',
        category: 'excellence',
        milestone: 'perfect_courses',
      },
    ];

    return allBadges.map(b => {
      let unlocked = false;
      if (b.milestone === 'level') {
        unlocked = level >= (b.minLevel || 0);
      }
      else if (b.milestone === 'courses_completed') {
        unlocked = completedCoursesCount >= (b.minCourses || 0);
      }
      else if (b.milestone === 'quiz_count') {
        unlocked = totalQuizzesPassed >= (b.minQuizzes || 0);
      }
      else if (b.milestone === 'learning_hours') {
        unlocked = totalHoursLearned >= (b.minHours || 0);
      }
      else if (b.milestone === 'domains_learned') {
        unlocked = domainsLearned.size >= (b.minDomains || 0);
      }
      else if (b.milestone === 'first_enrollment') unlocked = hasFirstEnrollment;
      else if (b.milestone === 'first_session') unlocked = hasFirstSession;
      else if (b.milestone === 'first_quiz') unlocked = hasFirstQuiz;
      else if (b.milestone === 'first_certificate') unlocked = hasFirstCertificate;
      else if (b.milestone === 'perfect_quiz') unlocked = hasPerfectQuiz;
      else if (b.milestone === 'streak_3') unlocked = hasStreak3;
      else if (b.milestone === 'streak_7') unlocked = hasStreak7;
      else if (b.milestone === 'streak_30') unlocked = hasStreak30;

      return {
        id: b.id,
        name: b.name,
        description: b.description,
        iconUrl: b.iconUrl,
        tier: b.tier,
        category: b.category,
        unlocked,
      };
    });
  }
}
