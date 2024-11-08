export class AlarmTypeNotificationItemDto {
  label: string;
  placeholder?: string;
  value?: string | boolean;
  name: string;
  type: string;
  required: boolean;
}

export class AlarmTypeNotificationResponseDto {
  name: string;
  data: AlarmTypeNotificationItemDto[];
}
