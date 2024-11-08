import { IsString } from 'class-validator';

export class FetchAlarmRequestDto {
  @IsString()
  key!: string;
}
