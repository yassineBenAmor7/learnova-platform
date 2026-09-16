import { IsString, IsInt, Min, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  recommended?: boolean;

  @IsInt()
  @Min(1)
  creatorId: number;
}
