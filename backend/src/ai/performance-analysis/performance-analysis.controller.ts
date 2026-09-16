import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { PerformanceAnalysisService, PerformanceAnalysisReport } from './performance-analysis.service';

@Controller('ai/performance-analysis')
export class PerformanceAnalysisController {
  constructor(private readonly performanceAnalysisService: PerformanceAnalysisService) {}

  @Get('user/:userId')
  async getUserPerformance(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PerformanceAnalysisReport> {
    return this.performanceAnalysisService.analyzeUserPerformance(userId);
  }

  @Get('me')
  async getMyPerformance(@Req() req: any): Promise<PerformanceAnalysisReport> {
    const userId = req.user?.id || 1; // Fallback to demo/active user if auth middleware detached
    return this.performanceAnalysisService.analyzeUserPerformance(userId);
  }
}
