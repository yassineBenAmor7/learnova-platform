import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto) {
    // Check if order number already exists for this session
    const existingVideo = await this.prisma.client.video.findFirst({
      where: {
        sessionId: createVideoDto.sessionId,
        orderNumber: createVideoDto.orderNumber,
      },
    });

    if (existingVideo) {
      throw new BadRequestException('A video with this order number already exists in this session');
    }

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

    // Check if order number already exists for this session (excluding current video)
    if (updateVideoDto.orderNumber !== undefined) {
      const existingVideo = await this.prisma.client.video.findFirst({
        where: {
          sessionId: updateVideoDto.sessionId || video.sessionId,
          orderNumber: updateVideoDto.orderNumber,
          id: { not: id }, // Exclude current video
        },
      });

      if (existingVideo) {
        throw new BadRequestException('A video with this order number already exists in this session');
      }
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
