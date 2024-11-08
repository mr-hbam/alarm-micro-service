import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';
import { AlarmTypeRepository } from '../../../../core/alarm/repositories/type.repository';
import { AlarmTypeEntity } from '../../../../core/alarm/entities/type.entity';
import { AlarmTypeValue } from '../../../../core/alarm/type/type.enum';
import { MongoCollections } from '../../common/mongodb/collections';

@Injectable()
export class MongoAlarmTypeRepository implements AlarmTypeRepository {
  private alarmTypeModel: Promise<Collection>;

  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.alarmTypeModel = mongodbClientProvider.getCollection(
      MongoCollections.TYPE,
    );
  }

  async findAll(): Promise<AlarmTypeEntity[]> {
    const collection = await this.alarmTypeModel;
    const types = await collection.find<AlarmTypeEntity>({}).toArray();
    return types;
  }

  async findByValue(value: AlarmTypeValue): Promise<AlarmTypeEntity | null> {
    const collection = await this.alarmTypeModel;
    const type = await collection.findOne<AlarmTypeEntity>({ value });
    return type;
  }
}
