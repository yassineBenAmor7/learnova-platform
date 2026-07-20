import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll(@CurrentUser() user: { id: number }, @Body() dto: EnrollCourseDto) {
    return this.enrollmentsService.enroll(user.id, dto.courseId);
  }

  @Get('my')
  findMyEnrollments(@CurrentUser() user: { id: number }) {
    return this.enrollmentsService.findByUser(user.id);
  }
}
