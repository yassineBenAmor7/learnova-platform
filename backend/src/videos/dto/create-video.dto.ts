import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsInt()
  @Min(1)
  orderNumber: number;

  @IsInt()
  @Min(1)
  sessionId: number;
}
