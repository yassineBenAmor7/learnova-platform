import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('public/overview')
  getPublicOverview() {
    return this.dashboardService.getPublicOverview();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyDashboard(@Request() req) {
    return this.dashboardService.getUserDashboard(req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  getUserDashboard(@Param('userId') userId: string) {
    return this.dashboardService.getUserDashboard(+userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('admin/all-data')
  @UseGuards(JwtAuthGuard)
  getAllData() {
    return this.dashboardService.getAllData();
  }
}
