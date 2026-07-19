import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto) {
    return this.prisma.client.video.create({
      data: createVideoDto,
      include: {
        session: true,
      },
    });
  }

  async findAll() {
    return this.prisma.client.video.findMany({
      include: {
        session: true,
      },
    });
  }

  async findBySession(sessionId: number) {
    return this.prisma.client.video.findMany({
      where: { sessionId },
      orderBy: { orderNumber: 'asc' },
      include: {
        session: true,
      },
    });
  }

  async findOne(id: number) {
    const video = await this.prisma.client.video.findUnique({
      where: { id },
      include: {
        session: true,
      },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.prisma.client.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return this.prisma.client.video.update({
      where: { id },
      data: updateVideoDto,
      include: {
        session: true,
      },
    });
  }

  async remove(id: number) {
    const video = await this.prisma.client.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return this.prisma.client.video.delete({
      where: { id },
    });
  }
}
