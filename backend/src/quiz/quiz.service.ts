import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    return this.prisma.client.quiz.create({
      data: createQuizDto,
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
}
