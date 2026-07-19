import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    return this.prisma.client.session.create({
      data: createSessionDto,
      include: {
        course: true,
        videos: true,
      },
    });
  }

  async findAll() {
    return this.prisma.client.session.findMany({
      include: {
        course: true,
        videos: true,
      },
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.client.session.findMany({
      where: { courseId },
      orderBy: { orderNumber: 'asc' },
      include: {
        videos: true,
      },
    });
  }

  async findOne(id: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
      include: {
        course: true,
        videos: {
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.client.session.update({
      where: { id },
      data: updateSessionDto,
      include: {
        course: true,
        videos: true,
      },
    });
  }

  async remove(id: number) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.client.session.delete({
      where: { id },
    });
  }
}
