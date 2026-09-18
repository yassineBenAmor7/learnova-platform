import {

  BadRequestException,

  ForbiddenException,

  Injectable,

  NotFoundException,

} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { GamificationService } from '../gamification/gamification.service';

import { CertificatesService } from '../certificates/certificates.service';



@Injectable()

export class LearningPathService {

  constructor(

    private prisma: PrismaService,

    private gamificationService: GamificationService,

    private certificatesService: CertificatesService,

  ) {}



  private findSessionQuiz(session: { id: number; title: string }, quizzes: any[]) {

    return quizzes.find((quiz) => {

      if (quiz.isExamMode) return false;

      if (quiz.sessionId) return quiz.sessionId === session.id;

      const quizTitle = quiz.title.toLowerCase();

      const sessionTitle = session.title.toLowerCase();

      return (

        quizTitle.includes(sessionTitle) ||

        sessionTitle.includes(quizTitle.replace('quiz', '').trim())

      );

    });

  }



  private async isReadingComplete(userId: number, session: { id: number; content?: string | null }) {

    if (!session.content?.trim()) return true;

    const read = await this.prisma.client.sessionReadCompletion.findUnique({

      where: { userId_sessionId: { userId, sessionId: session.id } },

    });

    return !!read;

  }



  private async areAllVideosComplete(

    userId: number,

    session: { videos: { id: number }[] },

  ) {

    if (!session.videos.length) return true;

    const watches = await this.prisma.client.videoWatch.findMany({

      where: { userId, videoId: { in: session.videos.map((v) => v.id) }, completed: true },

    });

    return watches.length >= session.videos.length;

  }



  async getCoursePath(userId: number, courseId: number) {

    const enrollment = await this.prisma.client.enrollment.findUnique({

      where: { userId_courseId: { userId, courseId } },

      include: {

        progress: true,

        course: {

          include: {

            sessions: {

              orderBy: { orderNumber: 'asc' },

              include: { videos: { orderBy: { orderNumber: 'asc' } } },

            },

            quizzes: { include: { questions: true } },

          },

        },

      },

    });



    if (!enrollment) {

      throw new NotFoundException('You must enroll in this course first');

    }



    const sessionIds = enrollment.course.sessions.map((s) => s.id);

    const [completions, readCompletions, passedQuizAttempts, watchedVideos] = await Promise.all([

      this.prisma.client.sessionCompletion.findMany({

        where: { userId, sessionId: { in: sessionIds } },

      }),

      this.prisma.client.sessionReadCompletion.findMany({

        where: { userId, sessionId: { in: sessionIds } },

      }),

      this.prisma.client.quizAttempt.findMany({

        where: { userId, passed: true, quiz: { courseId } },

        select: { quizId: true },

      }),

      this.prisma.client.videoWatch.findMany({

        where: {

          userId,

          videoId: { in: enrollment.course.sessions.flatMap((s) => s.videos.map((v) => v.id)) },

        },

      }),

    ]);



    const completedSessionIds = new Set(completions.map((c) => c.sessionId));

    const readSessionIds = new Set(readCompletions.map((r) => r.sessionId));

    const passedQuizIds = new Set(passedQuizAttempts.map((a) => a.quizId));

    const watchedVideoMap = new Map(

      watchedVideos.map((w) => [w.videoId, { completed: w.completed, watchedSeconds: w.watchedSeconds }]),

    );



    const practiceQuizzes = enrollment.course.quizzes.filter((q) => !q.isExamMode);

    const finalExam = enrollment.course.quizzes.find((q) => q.isExamMode);



    const sessionQuizPassed = (session: (typeof enrollment.course.sessions)[0]) => {

      const quiz = this.findSessionQuiz(session, enrollment.course.quizzes);

      if (!quiz) return true;

      return passedQuizIds.has(quiz.id);

    };



    let priorSessionsSatisfied = true;

    const sessions = enrollment.course.sessions.map((session, index) => {
      const isCompleted = completedSessionIds.has(session.id);
      const readingCompleted = !session.content?.trim() || readSessionIds.has(session.id);

      const sessionQuiz = this.findSessionQuiz(session, enrollment.course.quizzes);
      const isSessionQuizPassed = sessionQuiz ? passedQuizIds.has(sessionQuiz.id) : true;

      // Sequential video locking within the session
      let priorVideosInSessionCompleted = true;
      const videos = session.videos.map((video, vIdx) => {
        const watch = watchedVideoMap.get(video.id);
        const isVideoCompleted = !!watch?.completed;

        // Video is locked if current session is locked OR if any previous video in this session is incomplete
        const canAccessSession = index === 0 || priorSessionsSatisfied;
        const isLocked = !canAccessSession ? true : (vIdx > 0 && !priorVideosInSessionCompleted);

        if (!isVideoCompleted) {
          priorVideosInSessionCompleted = false;
        }

        return {
          ...video,
          isCompleted: isVideoCompleted,
          watchedSeconds: watch?.watchedSeconds || 0,
          isLocked,
        };
      });

      const allVideosCompleted = session.videos.length === 0 || session.videos.every((v) => {
        const watch = watchedVideoMap.get(v.id);
        return !!watch?.completed;
      });

      // To unlock the NEXT session:
      // 1. ALL videos in this session must be completed
      // 2. The practice quiz of this session must be passed with success
      // 3. Reading completed (if content exists)
      const thisSessionComplete = allVideosCompleted && isSessionQuizPassed && readingCompleted;

      const canAccess = index === 0 ? true : priorSessionsSatisfied;

      if (!thisSessionComplete) {
        priorSessionsSatisfied = false;
      }

      return {
        ...session,
        videos,
        sessionQuiz,
        readingCompleted,
        sessionQuizPassed: isSessionQuizPassed,
        allVideosCompleted,
        isCompleted: thisSessionComplete || isCompleted,
        isLocked: index > 0 && !canAccess,
        canAccess,
      };
    });



    const allPracticeQuizzesPassed =

      practiceQuizzes.length === 0 ||

      practiceQuizzes.every((q) => passedQuizIds.has(q.id));



    const lastSession = sessions[sessions.length - 1];

    const lastSessionQuiz = lastSession

      ? this.findSessionQuiz(lastSession, enrollment.course.quizzes)

      : null;

    const lastPracticeQuizPassed =

      !lastSessionQuiz || passedQuizIds.has(lastSessionQuiz.id);



    return {

      enrollment,

      sessions,

      quizUnlocked: allPracticeQuizzesPassed && lastPracticeQuizPassed,

      finalExamUnlocked: allPracticeQuizzesPassed && lastPracticeQuizPassed,

      quizzes: enrollment.course.quizzes,

      finalExam,

      practiceQuizzes,

    };

  }



  async trackReadingComplete(userId: number, sessionId: number) {

    const session = await this.prisma.client.session.findUnique({

      where: { id: sessionId },

      include: { videos: true, course: true },

    });



    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);



    const enrollment = await this.prisma.client.enrollment.findUnique({

      where: { userId_courseId: { userId, courseId: session.courseId } },

    });

    if (!enrollment) throw new ForbiddenException('You must enroll in this course first');



    await this.prisma.client.sessionReadCompletion.upsert({

      where: { userId_sessionId: { userId, sessionId } },

      create: { userId, sessionId },

      update: { completedAt: new Date() },

    });



    return this.tryAutoCompleteSession(userId, sessionId);

  }



  async tryAutoCompleteSession(userId: number, sessionId: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id: sessionId },
      include: {
        videos: true,
        course: {
          include: {
            sessions: { orderBy: { orderNumber: 'asc' } },
            quizzes: true,
          },
        },
      },
    });

    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);

    const alreadyDone = await this.prisma.client.sessionCompletion.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (alreadyDone) {
      return { autoCompleted: false, alreadyCompleted: true };
    }

    const videosDone = await this.areAllVideosComplete(userId, session);
    const readingDone = await this.isReadingComplete(userId, session);

    const sessionQuiz = this.findSessionQuiz(session, session.course.quizzes || []);
    let quizPassed = true;
    if (sessionQuiz) {
      const attempt = await this.prisma.client.quizAttempt.findFirst({
        where: { userId, quizId: sessionQuiz.id, passed: true },
      });
      quizPassed = !!attempt;
    }

    if (!videosDone || !readingDone || !quizPassed) {
      return {
        autoCompleted: false,
        videosDone,
        readingDone,
        quizPassed,
        message: 'Complete all videos, reading notes, and pass the practice quiz to complete this chapter',
      };
    }

    return this.completeSession(userId, sessionId, true);
  }

  async completeSession(userId: number, sessionId: number, isAuto = false) {
    const session = await this.prisma.client.session.findUnique({
      where: { id: sessionId },
      include: {
        videos: true,
        course: {
          include: {
            sessions: { orderBy: { orderNumber: 'asc' } },
            quizzes: true,
          },
        },
      },
    });

    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);

    const enrollment = await this.prisma.client.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: session.courseId } },
      include: { progress: true },
    });

    if (!enrollment) throw new ForbiddenException('You must enroll in this course first');

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

    const videosDone = await this.areAllVideosComplete(userId, session);
    const readingDone = await this.isReadingComplete(userId, session);

    const sessionQuiz = this.findSessionQuiz(session, session.course.quizzes || []);
    let quizPassed = true;
    if (sessionQuiz) {
      const attempt = await this.prisma.client.quizAttempt.findFirst({
        where: { userId, quizId: sessionQuiz.id, passed: true },
      });
      quizPassed = !!attempt;
    }

    if (!videosDone || !readingDone || !quizPassed) {
      throw new BadRequestException(
        'You must watch all session videos, complete the reading notes, and pass the practice quiz before completing this chapter',
      );
    }



    await this.prisma.client.sessionCompletion.upsert({

      where: { userId_sessionId: { userId, sessionId } },

      create: { userId, sessionId },

      update: { completedAt: new Date() },

    });



    const completedCount = await this.prisma.client.sessionCompletion.count({

      where: { userId, sessionId: { in: session.course.sessions.map((s) => s.id) } },

    });



    const totalSessions = session.course.sessions.length;

    const percentage = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;



    await this.prisma.client.progress.update({

      where: { enrollmentId: enrollment.id },

      data: { completedSessions: completedCount, percentage, lastAccess: new Date() },

    });



    await this.gamificationService.addPoints(userId, 10, 'session_completed');

    await this.gamificationService.updateStreak(userId);



    return {

      message: isAuto ? 'Session auto-completed' : 'Session completed',

      autoCompleted: isAuto,

      completedSessions: completedCount,

      percentage,

      xpAwarded: 10,

    };

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



    if (!video) throw new NotFoundException(`Video with ID ${videoId} not found`);



    const enrollment = await this.prisma.client.enrollment.findUnique({

      where: { userId_courseId: { userId, courseId: video.session.courseId } },

    });

    if (!enrollment) throw new ForbiddenException('You must enroll in this course first');



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



      await this.tryAutoCompleteSession(userId, video.sessionId);

    }



    await this.gamificationService.updateStreak(userId);

    return watch;

  }



  async checkAndGenerateCertificate(userId: number, courseId: number) {

    const existingCertificate = await this.prisma.client.certificate.findFirst({

      where: { userId, courseId },

    });

    if (existingCertificate) {

      return { message: 'Certificate already issued', certificate: existingCertificate };

    }



    const course = await this.prisma.client.course.findUnique({

      where: { id: courseId },

      include: { sessions: true, quizzes: true },

    });

    if (!course) throw new NotFoundException('Course not found');

    // Check if ALL practice quizzes are passed for final exam
    const practiceQuizzes = course.quizzes.filter((q) => !q.isExamMode);

    if (practiceQuizzes.length > 0) {
      const passedPractice = await this.prisma.client.quizAttempt.count({
        where: { userId, passed: true, quizId: { in: practiceQuizzes.map((q) => q.id) } },
      });

      if (passedPractice !== practiceQuizzes.length) {
        return { message: 'Not all practice quizzes passed', progress: `${passedPractice}/${practiceQuizzes.length}` };
      }
    }

    const examQuiz = course.quizzes.find((q) => q.isExamMode);



    if (examQuiz) {

      const examPassed = await this.prisma.client.quizAttempt.findFirst({

        where: { userId, quizId: examQuiz.id, passed: true },

      });

      if (!examPassed) return { message: 'Final exam not passed yet' };

    }



    const certificate = await this.certificatesService.create({ userId, courseId });

    return { message: 'Certificate generated successfully', certificate };

  }

}


