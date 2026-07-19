import { IsInt, Min } from 'class-validator';

export class CreateProgressDto {
  @IsInt()
  @Min(1)
  enrollmentId: number;

  @IsInt()
  @Min(0)
  completedSessions: number;

  @IsInt()
  @Min(0)
  completedVideos: number;

  @IsInt()
  @Min(0)
  percentage: number;
}
