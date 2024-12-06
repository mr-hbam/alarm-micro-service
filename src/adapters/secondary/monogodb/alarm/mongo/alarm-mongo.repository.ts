import { Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { AlarmRepository } from '../../../../../core/alarm/repositories/alarm.repository';
import { MongoDbClientProvider } from '../../../../../configurations/mongodb/mongodb-client';
import { MongoCollections } from '../../../common/mongodb/collections';
import { AlarmEntity } from '../../../../../core/alarm/entities/alarm.entity';
import { MongoAlarmItem } from './type';
import { mapper } from '../../../../../common/mappings/mapper';
import { MongoFilterNamespaceOptionsType } from '../../../common/type';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../../primaries/nest/alarm/dto/create-alarm.dto';

@Injectable()
export class MongoAlarmRepository implements AlarmRepository {
  private alarmModel: Promise<Collection>;

  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.alarmModel = mongodbClientProvider.getCollection(
      MongoCollections.ALARM,
    );
  }

  async find(
    query: any,
    page: number,
    limit: number,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity[]> {
    const collection = await this.alarmModel;
    const alarms = await collection
      .find<MongoAlarmItem>({ ...query, namespace: options.namespace })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return alarms.map((alarm) =>
      mapper.map(alarm, MongoAlarmItem, AlarmEntity),
    );
  }

  async count(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<number> {
    const collection = await this.alarmModel;
    return collection.countDocuments({
      ...query,
      namespace: options.namespace,
    });
  }

  async findAlarm(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity | null> {
    const collection = await this.alarmModel;
    const alarm = await collection.findOne<MongoAlarmItem>({
      ...query,
      namespace: options.namespace,
    });
    return alarm ? mapper.map(alarm, MongoAlarmItem, AlarmEntity) : null;
  }

  async createAlarm(
    payload: CreateAlarmRequestDto & {
      namespace: string;
      createdBy: string;
      updatedBy: string;
    },
  ): Promise<CreateAlarmResponseDto> {
    const collection = await this.alarmModel;
    const alarm = {
      _id: new ObjectId(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(alarm);

    return {
      success: result.acknowledged,
      key: result.insertedId.toString(),
    };
  }

  async updateAlarm(
    query: any,
    payload: Partial<AlarmEntity>,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const collection = await this.alarmModel;
    const result = await collection.updateOne(
      { ...query, namespace: options.namespace },
      {
        $set: {
          ...payload,
          updatedBy: options.key,
          updatedAt: new Date(),
        },
      },
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async deleteAlarm(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<boolean> {
    const collection = await this.alarmModel;
    const result = await collection.deleteOne({
      ...query,
      namespace: options.namespace,
    });
    return result.deletedCount > 0;
  }
}
