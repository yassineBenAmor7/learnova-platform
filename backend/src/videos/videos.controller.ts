import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/videos',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
      }
    },
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
    },
  }))
  async uploadVideo(@UploadedFile() file: any) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `/uploads/videos/${file.filename}`,
    };
  }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get('session/:sessionId')
  findBySession(@Param('sessionId') sessionId: string) {
    return this.videosService.findBySession(+sessionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
