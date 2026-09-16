import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async getUserAttempts(userId: number) {
    return this.prisma.client.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async validateAssessmentSequence(userId: number, quizId: number) {
    // Disabled sequence validation to allow access to all quizzes
    return true;
  }

  async validateExamAttempts(userId: number, quizId: number) {
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Only apply to final exams (isExamMode = true)
    if (!quiz.isExamMode) {
      return { allowed: true, reason: null, attemptsRemaining: null };
    }

    // Get all attempts for this user on this quiz
    const attempts = await this.prisma.client.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { startedAt: 'desc' },
    });

    // Check if user has already passed this exam
    const passedAttempt = attempts.find(a => a.passed === true);
    if (passedAttempt) {
      return {
        allowed: false,
        reason: 'You have already passed this final exam. You cannot retake it.',
        attemptsRemaining: 0,
      };
    }

    // Check if user has exceeded 3 attempts
    if (attempts.length >= 3) {
      return {
        allowed: false,
        reason: 'You have used all 3 attempts for this final exam. Please contact support if you need assistance.',
        attemptsRemaining: 0,
      };
    }

    const attemptsRemaining = 3 - attempts.length;
    return {
      allowed: true,
      reason: null,
      attemptsRemaining,
    };
  }

  async create(createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;
    
    const quiz = await this.prisma.client.quiz.create({
      data: {
        ...quizData,
        ...(questions && questions.length > 0 ? {
          questions: {
            create: questions.map(q => ({
              text: q.text,
              options: {
                create: q.options.map(o => ({
                  text: o.text,
                  isCorrect: o.isCorrect === 1,
                  explanation: o.explanation || null,
                })),
              },
            })),
          },
        } : {}),
      },
      include: {
        course: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return quiz;
  }

  async findAll() {
    return this.prisma.client.quiz.findMany({
      include: {
        course: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.client.quiz.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id },
      include: {
        course: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    
    return this.prisma.client.quiz.update({
      where: { id },
      data: updateQuizDto,
      include: {
        course: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return this.prisma.client.quiz.delete({
      where: { id },
    });
  }

  async calculateScore(attemptId: number) {
    const attempt = await this.prisma.client.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt with ID ${attemptId} not found`);
    }

    let correctAnswers = 0;
    for (const answer of attempt.answers) {
      if (answer.isCorrect) {
        correctAnswers++;
      }
    }

    const totalQuestions = attempt.answers.length;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return this.prisma.client.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        passed: score >= 70, // 70% is the passing threshold
      },
    });
  }

  async getQuizForAttempt(id: number, userId?: number) {
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id },
      include: {
        course: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    // For practice quizzes (not final exams), validate session completion
    if (!quiz.isExamMode && userId && quiz.sessionId) {
      // Find the session associated with this quiz
      const session = await this.prisma.client.session.findUnique({
        where: {
          id: quiz.sessionId,
        },
        include: {
          videos: true,
        },
      });

      if (session) {
        // Check if the user has completed this session OR has completed all videos
        const sessionCompletion = await this.prisma.client.sessionCompletion.findUnique({
          where: {
            userId_sessionId: {
              userId,
              sessionId: session.id,
            },
          },
        });

        // If session is not completed, check if all videos are completed
        if (!sessionCompletion && session.videos.length > 0) {
          const videoIds = session.videos.map(v => v.id);
          const completedVideos = await this.prisma.client.videoWatch.findMany({
            where: {
              userId,
              videoId: { in: videoIds },
              completed: true,
            },
          });

          if (completedVideos.length < session.videos.length) {
            throw new ForbiddenException(
              'Complete all videos in this session before attempting the practice quiz.'
            );
          }
        }
      }
    }

    // Apply randomization based on quiz settings
    let questions = quiz.questions;

    if (quiz.randomizeQuestions) {
      questions = this.shuffleArray(questions);
    }

    if (quiz.randomizeAnswers) {
      questions = questions.map(question => ({
        ...question,
        options: this.shuffleArray(question.options),
      }));
    }

    return {
      ...quiz,
      questions,
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
