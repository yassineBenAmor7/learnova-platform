import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [PrismaModule, QuizModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
