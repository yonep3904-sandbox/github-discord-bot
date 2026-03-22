import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ManualStandardNotificationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string | null;

  @IsString()
  @MaxLength(2000)
  message: string;
}
