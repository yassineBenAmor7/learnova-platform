import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsBoolean, IsInt, Min } from 'class-validator';
import { LearningPathService } from './learning-path.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class TrackVideoDto {
  @IsInt()
  @Min(0)
  watchedSeconds: number;

  @IsBoolean()
  completed: boolean;
}

@Controller('learning-path')
@UseGuards(JwtAuthGuard)
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Get('course/:courseId')
  getCoursePath(
    @CurrentUser() user: { id: number },
    @Param('courseId') courseId: string,
  ) {
    return this.learningPathService.getCoursePath(user.id, +courseId);
  }

  @Post('session/:sessionId/complete')
  completeSession(
    @CurrentUser() user: { id: number },
    @Param('sessionId') sessionId: string,
  ) {
    return this.learningPathService.completeSession(user.id, +sessionId);
  }

  @Post('video/:videoId/watch')
  trackVideo(
    @CurrentUser() user: { id: number },
    @Param('videoId') videoId: string,
    @Body() dto: TrackVideoDto,
  ) {
    return this.learningPathService.trackVideoWatch(
      user.id,
      +videoId,
      dto.watchedSeconds,
      dto.completed,
    );
  }
}
