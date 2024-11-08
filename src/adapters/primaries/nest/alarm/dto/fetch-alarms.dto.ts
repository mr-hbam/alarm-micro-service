import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';
import { Type } from 'class-transformer';

export class FetchAlarmsRequestDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsEnum(AlarmTypeValue)
  type?: AlarmTypeValue;
}

export class FetchAlarmsResponseDto {
  data: {
    key: string;
    type: AlarmTypeValue;
    name: string;
    description?: string;
    settings: Record<string, any>;
    notifications: Record<string, any>;
    schedule: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }[];
  total: number;
  page: number;
  limit: number;
}
