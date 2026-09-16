import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatbotController } from './chatbot/chatbot.controller';
import { ChatbotService } from './chatbot/chatbot.service';
import { RecommendationController } from './recommendation/recommendation.controller';
import { RecommendationService } from './recommendation/recommendation.service';
import { QuizGeneratorController } from './quiz-generator/quiz-generator.controller';
import { QuizGeneratorService } from './quiz-generator/quiz-generator.service';
import { PerformanceAnalysisController } from './performance-analysis/performance-analysis.controller';
import { PerformanceAnalysisService } from './performance-analysis/performance-analysis.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    ChatbotController,
    RecommendationController,
    QuizGeneratorController,
    PerformanceAnalysisController,
  ],
  providers: [
    ChatbotService,
    RecommendationService,
    QuizGeneratorService,
    PerformanceAnalysisService,
  ],
  exports: [
    ChatbotService,
    RecommendationService,
    QuizGeneratorService,
    PerformanceAnalysisService,
  ],
})
export class AiModule {}
