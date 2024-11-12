import { AutoMap } from '@automapper/classes';
import { AlarmTypeValue } from '../../../../core/alarm/type/type.enum';

export class MongoAlarmItem {
  @AutoMap()
  _id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  type: AlarmTypeValue;

  @AutoMap()
  description: string;

  @AutoMap()
  settings: {
    speed_limit: string;
    bindzone: boolean;
  };

  @AutoMap()
  notifications: {
    text: {
      notification_text: string;
    };
    push: boolean;
    emergency: boolean;
    recipients: {
      email: string[];
      sms: string[];
    };
  };

  @AutoMap()
  schedule: {
    template: string;
    intervals: {
      day: string;
      start: string;
      end: string;
    }[];
  };

  @AutoMap()
  namespace: string;

  @AutoMap()
  createdAt: string;

  @AutoMap()
  updatedAt: string;

  @AutoMap()
  unit: {
    key: string;
  }[];
}

export class FindAlarmItemResponse {
  @AutoMap()
  key: string;

  @AutoMap()
  name: string;

  @AutoMap()
  type: AlarmTypeValue;

  @AutoMap()
  description: string;

  @AutoMap()
  settings: {
    speed_limit: string;
    bindzone: boolean;
  };

  @AutoMap()
  notifications: {
    text: {
      notification_text: string;
    };
    push: boolean;
    emergency: boolean;
    recipients: {
      email: string[];
      sms: string[];
    };
  };

  @AutoMap()
  schedule: {
    template: string;
    intervals: {
      day: string;
      start: string;
      end: string;
    }[];
  };

  @AutoMap()
  namespace: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  unit: string[];
}
