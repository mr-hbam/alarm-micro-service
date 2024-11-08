export class AlarmTypeSettingItemDto {
  type: string;
  required: boolean;
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string | boolean;
}

export class AlarmTypeSettingResponseDto {
  name: string;
  data: AlarmTypeSettingItemDto[];
}
