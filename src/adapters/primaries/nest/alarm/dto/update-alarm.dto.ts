import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationsDto, ScheduleDto } from './alarm.dto';
import { CreateAlarmRequestDto } from './create-alarm.dto';

export class UpdateAlarmRequestDto implements Partial<CreateAlarmRequestDto> {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @ValidateNested()
  @IsOptional()
  @Type(() => NotificationsDto)
  notifications?: NotificationsDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;
}

export class UpdateAlarmResponseDto {
  success: boolean;
}

export interface UpdateResponse {
  success: boolean;
  modifiedCount: number;
}
