import { AutoMap } from '@automapper/classes';
import { AlarmTypeValue } from '../type/type.enum';

export class AlarmEntity {
  @AutoMap()
  key: string;

  @AutoMap()
  namespace: string;

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
  unit: string[];

  @AutoMap()
  schedule: Record<string, any>;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
