import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const { courseId, paymentMethod, couponCode } = checkoutDto;

    // 1. Verify Course Exists
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
      include: { creator: true },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // 2. Check if user is already enrolled
    const existingEnrollment = await this.prisma.client.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    // 3. Calculate Final Price
    let originalPrice = course.isPaid ? course.price : 0;
    let discount = 0;

    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'LEARNOVA100' || code === 'FREE100') {
        discount = originalPrice; // 100% off
      } else if (code === 'PROMO20' || code === 'WELCOME20') {
        discount = originalPrice * 0.20; // 20% off
      } else if (code === 'PROMO50') {
        discount = originalPrice * 0.50; // 50% off
      } else {
        throw new BadRequestException('Invalid coupon code');
      }
    }

    const finalAmount = Math.max(0, originalPrice - discount);
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Record Payment in DB
    const payment = await this.prisma.client.payment.create({
      data: {
        userId,
        courseId,
        amount: finalAmount,
        currency: 'USD',
        status: 'COMPLETED',
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        transactionId,
      },
    });

    // 5. Automatically create Enrollment & Progress
    const enrollment = await this.prisma.client.enrollment.create({
      data: {
        userId,
        courseId,
        progress: {
          create: {
            completedSessions: 0,
            completedVideos: 0,
            percentage: 0,
            learningTimeSeconds: 0,
          },
        },
      },
      include: {
        course: true,
      },
    });

    return {
      message: 'Payment processed successfully',
      receipt: {
        transactionId: payment.transactionId,
        paymentId: payment.id,
        amountPaid: payment.amount,
        originalPrice,
        discountApplied: discount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        date: payment.createdAt,
        status: payment.status,
        course: {
          id: course.id,
          title: course.title,
          level: course.level,
          domain: course.domain,
          thumbnail: course.thumbnail,
        },
      },
      enrollment,
    };
  }

  async validateCoupon(code: string, originalPrice: number) {
    if (!code) {
      throw new BadRequestException('Coupon code is required');
    }

    const cleanCode = code.trim().toUpperCase();
    let discount = 0;
    let percentage = 0;

    if (cleanCode === 'LEARNOVA100' || cleanCode === 'FREE100') {
      discount = originalPrice;
      percentage = 100;
    } else if (cleanCode === 'PROMO20' || cleanCode === 'WELCOME20') {
      discount = originalPrice * 0.20;
      percentage = 20;
    } else if (cleanCode === 'PROMO50') {
      discount = originalPrice * 0.50;
      percentage = 50;
    } else {
      throw new BadRequestException('Invalid or expired coupon code');
    }

    const finalAmount = Math.max(0, originalPrice - discount);

    return {
      valid: true,
      code: cleanCode,
      percentage,
      discount: Math.round(discount * 100) / 100,
      originalPrice,
      finalAmount: Math.round(finalAmount * 100) / 100,
    };
  }

  async getUserTransactions(userId: number) {
    return this.prisma.client.payment.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
