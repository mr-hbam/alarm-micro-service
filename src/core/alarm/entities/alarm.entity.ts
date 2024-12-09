import { AutoMap } from '@automapper/classes';
import { CreateAtUpdateAt } from '../../common/repository/global.repository';
import { AlarmTypeValue } from '../type/type.enum';

export class AlarmEntity extends CreateAtUpdateAt {
  @AutoMap()
  key!: string;

  @AutoMap()
  namespace!: string;

  @AutoMap()
  type!: AlarmTypeValue;

  @AutoMap()
  name!: string;

  @AutoMap()
  description?: string;

  @AutoMap()
  settings!: Record<string, any>;

  @AutoMap()
  notifications!: Record<string, any>;

  @AutoMap()
  schedule!: Record<string, any>;

  @AutoMap()
  createdBy!: { key: string; name: string };

  @AutoMap()
  updatedBy!: { key: string; name: string };

  @AutoMap()
  createdAt!: Date;

  @AutoMap()
  updatedAt!: Date;
}
