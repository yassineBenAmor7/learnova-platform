import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { QuizGeneratorService, GeneratedQuizResponse } from './quiz-generator.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';

@Controller('ai/quiz-generator')
export class QuizGeneratorController {
  constructor(private readonly quizGeneratorService: QuizGeneratorService) {}

  @Post('generate')
  async generateQuiz(@Body() dto: GenerateQuizDto): Promise<GeneratedQuizResponse> {
    return this.quizGeneratorService.generateQuiz(dto);
  }
}
