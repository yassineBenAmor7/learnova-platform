import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.quizService.findByCourse(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }

  @Post('attempt/:attemptId/calculate-score')
  calculateScore(@Param('attemptId') attemptId: string) {
    return this.quizService.calculateScore(+attemptId);
  }

  @Get('attempts/:userId')
  getUserAttempts(@Param('userId') userId: string) {
    return this.quizService.getUserAttempts(+userId);
  }

  @Get(':id/for-attempt')
  getQuizForAttempt(@Param('id') id: string, @CurrentUser() user: { id: number }) {
    return this.quizService.getQuizForAttempt(+id, user.id);
  }

  @Get(':id/validate-exam-attempts/:userId')
  validateExamAttempts(@Param('id') id: string, @Param('userId') userId: string) {
    return this.quizService.validateExamAttempts(+userId, +id);
  }
}
