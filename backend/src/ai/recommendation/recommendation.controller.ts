import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RecommendationService, RecommendationResponse } from './recommendation.service';

@Controller('ai/recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  async getRecommendations(
    @Query('userId') userIdParam?: string,
    @Query('limit') limitParam?: string,
    @Req() req?: any,
  ): Promise<RecommendationResponse> {
    const limit = limitParam ? parseInt(limitParam, 10) : 6;
    const resolvedUserId = userIdParam ? parseInt(userIdParam, 10) : (req?.user?.id || undefined);

    if (resolvedUserId) {
      return this.recommendationService.getRecommendationsForUser(resolvedUserId, limit);
    }

    return this.recommendationService.getColdStartRecommendations(limit);
  }
}
