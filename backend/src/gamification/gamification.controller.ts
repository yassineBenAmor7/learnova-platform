import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('points/:userId')
  getUserPoints(@Param('userId') userId: string) {
    return this.gamificationService.getUserPoints(+userId);
  }

  @Get('badges/:userId')
  getUserBadges(@Param('userId') userId: string) {
    return this.gamificationService.getUserBadges(+userId);
  }

  @Post('award')
  awardPoints(@Body() body: { userId: number; points: number; reason: string }) {
    return this.gamificationService.awardPoints(body.userId, body.points, body.reason);
  }

  @Get('streak/:userId')
  getUserStreak(@Param('userId') userId: string) {
    return this.gamificationService.getUserStreak(+userId);
  }
}
