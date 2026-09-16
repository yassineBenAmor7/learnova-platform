import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, Min, Max, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
}

export class CreateQuestionOptionDto {
  @IsString()
  text: string;

  @IsInt()
  @Min(0)
  isCorrect: number;

  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  courseId: number;

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
