import { IsString } from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';

export class FetchAlarmRequestDto {
  @IsString()
  key!: string;
}

export class FetchAlarmResponseDto {
  key: string;
  type: AlarmTypeValue;
  name: string;
  description?: string;
  settings: Record<string, any>;
  notifications: Record<string, any>;
  schedule: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
