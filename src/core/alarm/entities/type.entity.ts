import { AlarmTypeValue } from '../type/type.enum';

export class AlarmTypeEntity {
  key: string;
  label: string;
  value: AlarmTypeValue;
  settings: {
    name: string;
    data: Array<{
      type: string;
      required: boolean;
      label?: string;
      placeholder?: string;
      name?: string;
      value?: string | boolean;
    }>;
  };
  notifications: {
    name: string;
    data: Array<{
      label: string;
      placeholder?: string;
      value?: string | boolean;
      name: string;
      type: string;
      required: boolean;
    }>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
