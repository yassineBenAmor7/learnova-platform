/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.client.user.create({
      data,
    });
  }
}
