import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    // Check if order number already exists for this course
    const existingSession = await this.prisma.client.session.findFirst({
      where: {
        courseId: createSessionDto.courseId,
        orderNumber: createSessionDto.orderNumber,
      },
    });

    if (existingSession) {
      throw new BadRequestException('A session with this order number already exists in this course');
    }

    const session = await this.prisma.client.session.create({
      data: createSessionDto,
      include: {
        course: true,
        videos: true,
      },
    });

    // Automatically create a practice quiz for this session
    await this.prisma.client.quiz.create({
      data: {
        title: `Practice Quiz: ${session.title}`,
        description: `Practice quiz for session: ${session.title}`,
        courseId: session.courseId,
        sessionId: session.id,
        isExamMode: false,
        passingScore: 70,
        timeLimitMinutes: 15,
        maxAttempts: 3,
        randomizeQuestions: true,
        randomizeAnswers: true,
        allowReviewAfterSubmission: true,
        showExplanationAfterAnswer: true,
      },
    });

    return session;
  }

  async findAll() {
    return this.prisma.client.session.findMany({
      include: {
        course: true,
        videos: true,
      },
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.client.session.findMany({
      where: { courseId },
      orderBy: { orderNumber: 'asc' },
      include: {
        videos: true,
      },
    });
  }

  async findOne(id: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
      include: {
        course: true,
        videos: {
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Check if order number already exists for this course (excluding current session)
    if (updateSessionDto.orderNumber !== undefined) {
      const existingSession = await this.prisma.client.session.findFirst({
        where: {
          courseId: updateSessionDto.courseId || session.courseId,
          orderNumber: updateSessionDto.orderNumber,
          id: { not: id }, // Exclude current session
        },
      });

      if (existingSession) {
        throw new BadRequestException('A session with this order number already exists in this course');
      }
    }

    return this.prisma.client.session.update({
      where: { id },
      data: updateSessionDto,
      include: {
        course: true,
        videos: true,
      },
    });
  }

  async remove(id: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.client.session.delete({
      where: { id },
    });
  }

  async generateQuizForSession(sessionId: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id: sessionId },
      include: {
        quizzes: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // Check if session already has a practice quiz
    const existingQuiz = session.quizzes.find(q => !q.isExamMode);
    if (existingQuiz) {
      throw new BadRequestException('This session already has a practice quiz');
    }

    // Create a practice quiz for this session
    const quiz = await this.prisma.client.quiz.create({
      data: {
        title: `Practice Quiz: ${session.title}`,
        description: `Practice quiz for session: ${session.title}`,
        courseId: session.courseId,
        sessionId: session.id,
        isExamMode: false,
        passingScore: 70,
        timeLimitMinutes: 15,
        maxAttempts: 3,
        randomizeQuestions: true,
        randomizeAnswers: true,
        allowReviewAfterSubmission: true,
        showExplanationAfterAnswer: true,
      },
    });

    return quiz;
  }

  async generateQuizzesForCourse(courseId: number) {
    const sessions = await this.prisma.client.session.findMany({
      where: { courseId },
      include: {
        quizzes: true,
      },
    });

    const createdQuizzes: any[] = [];

    for (const session of sessions) {
      // Check if session already has a practice quiz
      const existingQuiz = session.quizzes.find(q => !q.isExamMode);
      if (!existingQuiz) {
        const quiz = await this.prisma.client.quiz.create({
          data: {
            title: `Practice Quiz: ${session.title}`,
            description: `Practice quiz for session: ${session.title}`,
            courseId: session.courseId,
            sessionId: session.id,
            isExamMode: false,
            passingScore: 70,
            timeLimitMinutes: 15,
            maxAttempts: 3,
            randomizeQuestions: true,
            randomizeAnswers: true,
            allowReviewAfterSubmission: true,
            showExplanationAfterAnswer: true,
          },
        });
        createdQuizzes.push(quiz);
      }
    }

    return {
      message: `Created ${createdQuizzes.length} practice quizzes for course`,
      quizzes: createdQuizzes,
    };
  }
}
