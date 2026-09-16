import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VideosService', () => {
  let service: VideosService;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockPrismaService = {
      client: {
        video: {
          findFirst: jest.fn(),
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
