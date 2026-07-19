import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  orderNumber: number;

  @IsInt()
  @Min(1)
  courseId: number;
}
