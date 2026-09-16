import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll(@Query('quizId') quizId?: number) {
    return this.questionsService.findAll(quizId ? Number(quizId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(Number(id), updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(Number(id));
  }
}
