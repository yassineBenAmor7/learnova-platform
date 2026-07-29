import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  getMyDashboard(@Request() req) {
    return this.dashboardService.getUserDashboard(req.user.id);
  }

  @Get('user/:userId')
  getUserDashboard(@Param('userId') userId: string) {
    return this.dashboardService.getUserDashboard(+userId);
  }

  @Get('admin')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}
