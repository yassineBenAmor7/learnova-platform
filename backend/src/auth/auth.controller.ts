import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for register
  @Post('register')
  register(@Body() data: any) {
    return this.authService.register(data);
  }


  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for login (stricter for security)
  @Post('login')
  login(@Body() data: any) {
    return this.authService.login(data.email, data.password);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for forgot password
  @Post('forgot-password')
  forgotPassword(@Body() data: { email: string }) {
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  resetPassword(@Body() data: { token: string; password: string }) {
    return this.authService.resetPassword(data.token, data.password);
  }

}