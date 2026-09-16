import { IsInt, IsNotEmpty, IsOptional, IsEnum, IsBoolean, Min, Max } from 'class-validator';

export enum QuizDifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class GenerateQuizDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;

  @IsOptional()
  @IsInt()
  sessionId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  questionCount?: number = 5;

  @IsOptional()
  @IsEnum(QuizDifficultyLevel)
  difficulty?: QuizDifficultyLevel = QuizDifficultyLevel.BEGINNER;

  @IsOptional()
  @IsBoolean()
  saveToDatabase?: boolean = false;

  @IsOptional()
  title?: string;
}
