import { IsInt, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CheckoutDto {
  @IsInt()
  @Min(1)
  courseId: number;

  @IsString()
  paymentMethod: string; // 'CREDIT_CARD', 'STRIPE', 'FLOUCI', 'COUPON'

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
