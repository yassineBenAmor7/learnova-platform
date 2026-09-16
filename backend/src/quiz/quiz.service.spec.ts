import { ForbiddenException } from '@nestjs/common';
import { QuizService } from './quiz.service';

describe('QuizService assessment sequencing', () => {
  it('blocks starting a quiz when the previous assessment was not passed', async () => {
    const prisma = {
      client: {
        quiz: {
          findUnique: jest.fn().mockResolvedValue({
            id: 2,
            courseId: 10,
            course: {
              quizzes: [
                { id: 1, createdAt: new Date('2026-01-01T00:00:00Z') },
                { id: 2, createdAt: new Date('2026-01-02T00:00:00Z') },
              ],
            },
          }),
          findMany: jest.fn().mockResolvedValue([
            { id: 1, createdAt: new Date('2026-01-01T00:00:00Z') },
            { id: 2, createdAt: new Date('2026-01-02T00:00:00Z') },
          ]),
        },
        quizAttempt: {
          findMany: jest.fn().mockResolvedValue([]),
        },
      },
    };

    const service = new QuizService(prisma as any);

    await expect(service.validateAssessmentSequence(42, 2)).rejects.toThrow(ForbiddenException);
  });
});
