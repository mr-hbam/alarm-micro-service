import { AutoMap } from '@automapper/classes';
import { AlarmTypeValue } from '../../type/type.enum';

export class CreateAlarmPayload {
  @AutoMap()
  type: AlarmTypeValue;

  @AutoMap()
  name: string;

  @AutoMap()
  description?: string;

  @AutoMap()
  settings: Record<string, any>;

  @AutoMap()
  notifications: Record<string, any>;

  @AutoMap()
  schedule: Record<string, any>;
}
