import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class RecipientDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class RecipientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  @IsOptional()
  sms?: RecipientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  @IsOptional()
  email?: RecipientDto[];
}

export class NotificationTextDto {
  @IsString()
  @IsNotEmpty()
  notification_text: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  @IsOptional()
  email?: RecipientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  @IsOptional()
  sms?: RecipientDto[];

  @IsBoolean()
  emergency: boolean;

  @IsBoolean()
  push: boolean;
}

export class ScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeIntervalDto)
  intervals: TimeIntervalDto[];
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

export class AlarmParamDto {
  @IsString()
  key!: string;
}
