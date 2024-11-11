import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';

export class TimeIntervalDto {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}

export class ScheduleDto {
  @IsString()
  @IsNotEmpty()
  template: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeIntervalDto)
  intervals: TimeIntervalDto[];
}

export class RecipientValueDto {
  @IsString()
  @IsOptional()
  value?: string;
}

export class RecipientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientValueDto)
  sms: RecipientValueDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientValueDto)
  email: RecipientValueDto[];
}

export class NotificationTextDto {
  @IsString()
  @IsOptional()
  notification_text?: string;

  @IsString()
  @IsOptional()
  notification_text_1?: string;

  @IsString()
  @IsOptional()
  notification_text_2?: string;
}

export class NotificationsDto {
  @ValidateNested()
  @Type(() => NotificationTextDto)
  text: NotificationTextDto;

  @ValidateNested()
  @Type(() => RecipientsDto)
  recipients: RecipientsDto;

  @IsBoolean()
  emergency: boolean;

  @IsBoolean()
  push: boolean;
}

export interface SettingsDto {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | string[]
    | Record<string, any>;
}

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
  settings!: SettingsDto;

  @ValidateNested()
  @Type(() => NotificationsDto)
  notifications!: NotificationsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unitIds: string[];

  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule!: ScheduleDto;
}

export class CreateAlarmResponseDto {
  namespace: string;
  success: boolean;
}

export class AlarmParamDto {
  @IsString()
  key!: string;
}

export class UpdateAlarmRequestDto
  implements Partial<Omit<CreateAlarmRequestDto, 'type'>>
{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  settings?: SettingsDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => NotificationsDto)
  notifications?: NotificationsDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;
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

export class DeleteAlarmResponseDto {
  success: boolean;
}

export class UpdateAlarmResponseDto {
  success: boolean;
}

export interface UpdateResponse {
  success: boolean;
  modifiedCount: number;
}
