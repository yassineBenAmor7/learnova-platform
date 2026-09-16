import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

const DEFAULT_DOMAIN_THUMBNAILS: Record<string, string> = {
  IT_DATA: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  FINANCE_BUSINESS: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  MANAGEMENT: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  MARKETING: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  SALES_E_COMMERCE: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80',
  DESIGN_CREATIVE: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
  LANGUAGE_COMMUNICATION: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
  HEALTH_WELLNESS: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
  PERSONAL_DEVELOPMENT: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
  ACADEMIC_SCIENCES: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  MUSIC_ARTS: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  HUMANITIES_SOCIAL: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80',
  LAW_LEGAL: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  LIFESTYLE_HOBBIES: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
};

function ensureThumbnail<T extends { domain?: string | null; thumbnail?: string | null }>(course: T): T {
  if (!course) return course;
  if (!course.thumbnail || course.thumbnail.trim() === '' || course.thumbnail.includes('example.com') || course.thumbnail.includes('localhost')) {
    const domain = course.domain || 'IT_DATA';
    course.thumbnail = DEFAULT_DOMAIN_THUMBNAILS[domain] || DEFAULT_DOMAIN_THUMBNAILS.IT_DATA;
  }
  return course;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    if (!createCourseDto.thumbnail || createCourseDto.thumbnail.trim() === '' || createCourseDto.thumbnail.includes('example.com')) {
      const domain = createCourseDto.domain || 'IT_DATA';
      createCourseDto.thumbnail = DEFAULT_DOMAIN_THUMBNAILS[domain] || DEFAULT_DOMAIN_THUMBNAILS.IT_DATA;
    }
    const created = await this.prisma.client.course.create({
      data: createCourseDto,
      include: {
        creator: true,
      },
    });
    return ensureThumbnail(created);
  }

  async findAll() {
    const courses = await this.prisma.client.course.findMany({
      include: {
        creator: true,
        sessions: true,
        quizzes: true,
      },
    });
    return courses.map(c => ensureThumbnail(c));
  }

  async findOne(id: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
      include: {
        creator: true,
        sessions: {
          include: {
            videos: true,
          },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return ensureThumbnail(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.prisma.client.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        creator: true,
      },
    });
  }

  async remove(id: number) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.prisma.client.course.delete({
      where: { id },
    });
  }
}
