import { Module } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { LearningPathController } from './learning-path.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [PrismaModule, GamificationModule, CertificatesModule],
  controllers: [LearningPathController],
  providers: [LearningPathService],
  exports: [LearningPathService],
})
export class LearningPathModule {}
