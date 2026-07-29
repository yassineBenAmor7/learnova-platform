import { Controller, Get, Put, Body, NotFoundException, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: { id: number }) {
    const profile = await this.usersService.findById(user.id);
    if (!profile) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return profile;
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: { id: number },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.usersService.findById(user.id);
    if (!profile) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return this.usersService.update(user.id, updateProfileDto);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  async getStatistics(@CurrentUser() user: { id: number }) {
    return this.usersService.getUserStatistics(user.id);
  }

  @Get('activity')
  @UseGuards(JwtAuthGuard)
  async getActivity(@CurrentUser() user: { id: number }) {
    return this.usersService.getUserActivity(user.id);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getSettings(@CurrentUser() user: { id: number }) {
    return this.usersService.getUserSettings(user.id);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  async updateSettings(
    @CurrentUser() user: { id: number },
    @Body() settings: any,
  ) {
    return this.usersService.updateUserSettings(user.id, settings);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@CurrentUser() user: { id: number }) {
    return this.usersService.getUserNotifications(user.id);
  }

  @Put('notifications')
  @UseGuards(JwtAuthGuard)
  async updateNotifications(
    @CurrentUser() user: { id: number },
    @Body() notifications: any,
  ) {
    return this.usersService.updateUserNotifications(user.id, notifications);
  }

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getPreferences(@CurrentUser() user: { id: number }) {
    return this.usersService.getUserPreferences(user.id);
  }

  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(
    @CurrentUser() user: { id: number },
    @Body() preferences: any,
  ) {
    return this.usersService.updateUserPreferences(user.id, preferences);
  }

  @Get('download-data')
  @UseGuards(JwtAuthGuard)
  async downloadData(@CurrentUser() user: { id: number }) {
    return this.usersService.downloadUserData(user.id);
  }

  @Post('delete-account')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @CurrentUser() user: { id: number },
    @Body() body: { password: string },
  ) {
    return this.usersService.deleteAccount(user.id, body.password);
  }
}
