import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class ChatQueryDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsInt()
  courseId?: number;

  @IsOptional()
  @IsInt()
  sessionId?: number;
}
