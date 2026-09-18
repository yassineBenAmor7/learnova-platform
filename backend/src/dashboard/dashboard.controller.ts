import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('admin/all-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllData() {
    return this.dashboardService.getAllData();
  }
}
