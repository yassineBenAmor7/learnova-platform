import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }

  @Post('start/:quizId/:userId')
  startExam(@Param('quizId') quizId: string, @Param('userId') userId: string) {
    return this.examsService.startExam(+quizId, +userId);
  }

  @Post('submit/:attemptId')
  submitExam(@Param('attemptId') attemptId: string, @Body() body: { answers: any[] }) {
    return this.examsService.submitExam(+attemptId, body.answers);
  }

  @Get('attempts/:userId')
  getExamAttempts(@Param('userId') userId: string) {
    return this.examsService.getExamAttempts(+userId);
  }

  @Get('status/:attemptId')
  getExamStatus(@Param('attemptId') attemptId: string) {
    return this.examsService.getExamStatus(+attemptId);
  }
}
