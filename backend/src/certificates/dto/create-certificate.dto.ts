import { IsInt, Min } from 'class-validator';

export class CreateCertificateDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  courseId: number;
}
