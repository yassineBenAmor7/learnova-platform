import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  providers: [AuthService, JwtStrategy],

  controllers: [AuthController],

  exports: [AuthService],
})
export class AuthModule {}
