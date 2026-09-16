import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number;

  @IsOptional()
  @IsBoolean()
  isExamMode?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimitMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @IsOptional()
  @IsBoolean()
  randomizeQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  randomizeAnswers?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReviewAfterSubmission?: boolean;

  @IsOptional()
  @IsBoolean()
  showExplanationAfterAnswer?: boolean;
}
