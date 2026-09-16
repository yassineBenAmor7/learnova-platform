import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(
    @CurrentUser() user: { id: number },
    @Body() checkoutDto: CheckoutDto,
  ) {
    return this.paymentsService.checkout(user.id, checkoutDto);
  }

  @Post('validate-coupon')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(
    @Body() body: { code: string; originalPrice: number },
  ) {
    return this.paymentsService.validateCoupon(body.code, body.originalPrice);
  }

  @Get('my-transactions')
  @UseGuards(JwtAuthGuard)
  async getMyTransactions(@CurrentUser() user: { id: number }) {
    return this.paymentsService.getUserTransactions(user.id);
  }
}
