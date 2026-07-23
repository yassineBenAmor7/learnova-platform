import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    return this.prisma.client.quiz.create({
      data: {
        ...createExamDto,
        isExamMode: true,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        course: true,
      },
    });
  }

  async findAll() {
    return this.prisma.client.quiz.findMany({
      where: { isExamMode: true },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        course: true,
      },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.client.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        course: true,
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.prisma.client.quiz.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return this.prisma.client.quiz.update({
      where: { id },
      data: updateExamDto,
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        course: true,
      },
    });
  }

  async remove(id: number) {
    const exam = await this.prisma.client.quiz.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return this.prisma.client.quiz.delete({
      where: { id },
    });
  }

  async startExam(quizId: number, userId: number) {
    const quiz = await this.findOne(quizId);
    
    const expiresAt = quiz.timeLimitMinutes 
      ? new Date(Date.now() + quiz.timeLimitMinutes * 60 * 1000)
      : null;

    const examAttempt = await this.prisma.client.quizAttempt.create({
      data: {
        quizId,
        userId,
        score: 0,
        isExamMode: true,
        startedAt: new Date(),
        expiresAt,
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    return examAttempt;
  }

  async submitExam(attemptId: number, answers: any[]) {
    const attempt = await this.prisma.client.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt with ID ${attemptId} not found`);
    }

    if (attempt.expiresAt && new Date() > attempt.expiresAt) {
      throw new NotFoundException('Exam time limit exceeded');
    }

    let correctAnswers = 0;
    const totalQuestions = attempt.quiz.questions.length;

    for (const answer of answers) {
      const question = attempt.quiz.questions.find(q => q.id === answer.questionId);
      if (question) {
        const correctOption = question.options.find(o => o.isCorrect);
        if (correctOption && answer.optionId === correctOption.id) {
          correctAnswers++;
        }
      }
    }

    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const passed = score >= attempt.quiz.passingScore;

    const updatedAttempt = await this.prisma.client.quizAttempt.update({
      where: { id: attemptId },
      data: {
        finishedAt: new Date(),
        score,
        passed,
      },
      include: {
        quiz: true,
      },
    });

    return updatedAttempt;
  }

  async getExamAttempts(userId: number) {
    return this.prisma.client.quizAttempt.findMany({
      where: { 
        userId,
        isExamMode: true,
      },
      include: {
        quiz: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async getExamStatus(attemptId: number) {
    const attempt = await this.prisma.client.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt with ID ${attemptId} not found`);
    }

    const now = new Date();
    const timeRemaining = attempt.expiresAt 
      ? Math.max(0, Math.floor((attempt.expiresAt.getTime() - now.getTime()) / 1000))
      : null;

    return {
      attemptId: attempt.id,
      status: attempt.finishedAt ? 'COMPLETED' : 'IN_PROGRESS',
      timeRemaining,
      timeLimitMinutes: attempt.quiz.timeLimitMinutes,
      isExpired: attempt.expiresAt && now > attempt.expiresAt,
    };
  }
}
