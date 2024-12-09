import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';
import { MongoCreateAtUpdateAt } from '../../../../../common/mappings/mapper';

export class MongoAlarmItem extends MongoCreateAtUpdateAt {
  @AutoMap()
  _id!: ObjectId;

  @AutoMap()
  type!: string;

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
  namespace!: string;
}

export class MongoAlarmTypeItem {
  _id: string;
  label: string;
  value: string;
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
  createdAt: Date;
  updatedAt: Date;
}
