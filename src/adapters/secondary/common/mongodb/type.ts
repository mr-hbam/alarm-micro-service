import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';
import { AlarmTypeEntity } from '../../../../core/alarm/entities/type.entity';

export interface MongoDocument {
  _id: ObjectId;
}

export interface MongoTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export type WithId<T> = T & MongoDocument;
export type WithTimestamps<T> = T & MongoTimestamps;

export class MongoFetchTypeItem {
  @AutoMap()
  _id!: ObjectId;

  @AutoMap()
  label!: string;

  @AutoMap()
  value!: AlarmTypeEntity;

  @AutoMap()
  settings?: Array<{
    type: string;
    required: boolean;
    label?: string;
    placeholder?: string;
    name?: string;
    value?: string;
  }>;

  @AutoMap()
  notifications?: Array<{
    label: string;
    placeholder?: string;
    value?: string;
    name: string;
    type: string;
    required: boolean;
  }>;
}
