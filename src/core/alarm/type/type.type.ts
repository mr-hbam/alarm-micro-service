export interface AlarmTypeSettingItem {
  type: string;
  required: boolean;
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string | boolean;
}

export type AlarmTypeSettingsResponse = AlarmTypeSettingItem;

export interface AlarmTypeNotificationItem {
  label: string;
  placeholder?: string;
  value?: string | boolean | any[];
  name: string;
  type: string;
  required?: boolean;
}

export type AlarmTypeNotificationsResponse = AlarmTypeNotificationItem;
