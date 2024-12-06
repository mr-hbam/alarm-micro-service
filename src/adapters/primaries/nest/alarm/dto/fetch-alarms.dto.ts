import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';
import { Type } from 'class-transformer';

export class FetchAlarmsRequestDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(AlarmTypeValue)
  type?: AlarmTypeValue;
}

export class FetchAlarmItemDto {
  key: string;

  type: AlarmTypeValue;

  name: string;

  description?: string;

  settings: Record<string, any>;

  notifications: Record<string, any>;

  schedule: Record<string, any>;

  namespace: string;

  createdBy?: { key: string; name: string };

  updatedBy?: { key: string; name: string };

  updatedAt: Date;
}

export class FetchAlarmsResponseDto {
  data: FetchAlarmItemDto[];

  total: number;

  page: number;

  limit: number;
}
