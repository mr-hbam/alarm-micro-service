import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';
import { AlarmRepository } from '../../../../core/alarm/repositories/alarm.repository';
import { MongoFilterNamespaceOptionsType } from '../../common/type';
import { MongoCollections } from '../../common/mongodb/collections';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../primaries/nest/alarm/dto/alarm.dto';
import { AlarmEntity } from '../../../../core/alarm/entities/alarm.entity';

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
    return collection
      .find<AlarmEntity>({ ...query, namespace: options.namespace })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
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
    return collection.findOne<AlarmEntity>({
      ...query,
      namespace: options.namespace,
    });
  }

  async createAlarm(
    payload: CreateAlarmRequestDto,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<CreateAlarmResponseDto> {
    const collection = await this.alarmModel;

    const alarm = {
      ...payload,
      namespace: options.namespace,
      key: options.key,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(alarm);

    return {
      namespace: options.namespace,
      success: result.acknowledged,
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
