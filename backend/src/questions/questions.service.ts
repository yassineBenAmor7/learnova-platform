import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { quizId, text, options } = createQuestionDto;

    // Verify quiz exists
    const quiz = await this.prisma.client.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Create question with options
    const question = await this.prisma.client.question.create({
      data: {
        text,
        quizId,
        options: {
          create: options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return question;
  }

  async findAll(quizId?: number) {
    if (quizId) {
      return this.prisma.client.question.findMany({
        where: { quizId },
        include: {
          options: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
    }

    return this.prisma.client.question.findMany({
      include: {
        options: true,
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.client.question.findUnique({
      where: { id },
      include: {
        options: true,
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    // Check if question exists
    const existingQuestion = await this.prisma.client.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const { text, options } = updateQuestionDto;

    // If options are provided, delete existing ones and create new ones
    if (options && options.length > 0) {
      await this.prisma.client.questionOption.deleteMany({
        where: { questionId: id },
      });
    }

    return this.prisma.client.question.update({
      where: { id },
      data: {
        ...(text && { text }),
        ...(options && {
          options: {
            create: options.map((option) => ({
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          },
        }),
      },
      include: {
        options: true,
      },
    });
  }

  async remove(id: number) {
    // Check if question exists
    const existingQuestion = await this.prisma.client.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Delete question (CASCADE DELETE will automatically delete related QuizAnswer and QuestionOption records)
    await this.prisma.client.question.delete({
      where: { id },
    });

    return { message: 'Question deleted successfully' };
  }
}
