import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';
import { Type } from 'class-transformer';
import { NotificationsDto, ScheduleDto } from './alarm.dto';

export class CreateAlarmRequestDto {
  @IsEnum(AlarmTypeValue)
  type!: AlarmTypeValue;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  settings!: Record<string, any>;

  @ValidateNested()
  @Type(() => NotificationsDto)
  notifications!: NotificationsDto;

  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule!: ScheduleDto;
}

export class CreateAlarmResponseDto {
  success: boolean;
  key: string;
}
