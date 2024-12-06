import { IsString } from 'class-validator';

export class DeleteRequestDto {
  @IsString()
  key!: string;
}

export class DeleteAlarmResponseDto {
  success: boolean;
}
