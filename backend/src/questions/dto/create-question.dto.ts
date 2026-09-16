import { IsString, IsInt, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionOptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsInt()
  quizId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
}
