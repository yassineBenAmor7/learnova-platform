import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { SessionsModule } from './sessions/sessions.module';
import { VideosModule } from './videos/videos.module';
import { QuizModule } from './quiz/quiz.module';
import { ProgressModule } from './progress/progress.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CertificatesModule } from './certificates/certificates.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per minute
      },
    ]),
    AuthModule,

    PrismaModule,

    CoursesModule,

    SessionsModule,

    VideosModule,
    QuizModule,
    ProgressModule,
    DashboardModule,
    CertificatesModule,
    GamificationModule,
  ],
})
export class AppModule {}
