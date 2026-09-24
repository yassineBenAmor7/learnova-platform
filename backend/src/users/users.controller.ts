import { Controller, Get, Put, Body, NotFoundException, UseGuards, Post, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async uploadAvatar(@CurrentUser() user: { id: number }, @UploadedFile() file: any) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateAvatar(user.id, avatarUrl);
    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: avatarUrl,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: { id: number }) {
    const profile = await this.usersService.findById(user.id);
    if (!profile) {
      throw new NotFoundException('User not found');
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
      throw new NotFoundException('User not found');
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

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(@CurrentUser() user: { id: number }) {
    return this.usersService.getAllUsers();
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteUserByAdmin(@Param('userId') userId: string) {
    return this.usersService.deleteUserByAdmin(+userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createUserByAdmin(
    @Body() createUserData: { firstName: string; lastName: string; email: string; password: string; roleId: number },
  ) {
    return this.usersService.createUserByAdmin(createUserData);
  }

  @Put(':userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { roleId: number },
  ) {
    return this.usersService.updateUserRole(+userId, body.roleId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserByAdmin(
    @Param('userId') userId: string,
    @Body() updateData: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.usersService.updateUserByAdmin(+userId, updateData);
  }
}
