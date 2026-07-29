import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('points/me')
  getMyPoints(@Request() req) {
    return this.gamificationService.getUserPoints(req.user.id);
  }

  @Get('points/:userId')
  getUserPoints(@Param('userId') userId: string) {
    return this.gamificationService.getUserPoints(+userId);
  }

  @Get('badges/me')
  getMyBadges(@Request() req) {
    return this.gamificationService.getUserBadges(req.user.id);
  }

  @Get('badges/:userId')
  getUserBadges(@Param('userId') userId: string) {
    return this.gamificationService.getUserBadges(+userId);
  }

  @Post('award')
  awardPoints(@Body() body: { userId: number; points: number; reason: string }) {
    return this.gamificationService.awardPoints(body.userId, body.points, body.reason);
  }

  @Get('streak/me')
  getMyStreak(@Request() req) {
    return this.gamificationService.getUserStreak(req.user.id);
  }

  @Get('streak/:userId')
  getUserStreak(@Param('userId') userId: string) {
    return this.gamificationService.getUserStreak(+userId);
  }
}
