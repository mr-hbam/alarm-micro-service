import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';

export class UpdateAlarmRequestDto {
  @IsOptional()
  @IsEnum(AlarmTypeValue)
  type?: AlarmTypeValue;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  notifications?: Record<string, any>;

  @IsOptional()
  schedule?: Record<string, any>;
}
