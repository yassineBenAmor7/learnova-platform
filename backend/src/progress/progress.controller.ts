import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  findAll() {
    return this.progressService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.progressService.findByUser(+userId);
  }

  @Get('user/:userId/course/:courseId')
  findByCourse(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.progressService.findByCourse(+userId, +courseId);
  }

  @Get('calculate/user/:userId/course/:courseId')
  calculateCourseProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.progressService.calculateCourseProgress(+userId, +courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Put('update/:enrollmentId')
  updateProgress(
    @Param('enrollmentId') enrollmentId: string,
    @Body() body: { completedSessions: number; completedVideos: number }
  ) {
    return this.progressService.updateProgress(+enrollmentId, body.completedSessions, body.completedVideos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}
