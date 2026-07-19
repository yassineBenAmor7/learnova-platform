import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsInt()
  @Min(1)
  creatorId: number;
}
