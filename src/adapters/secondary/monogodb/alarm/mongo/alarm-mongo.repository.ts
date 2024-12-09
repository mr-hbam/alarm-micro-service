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
import {
  aggregateLookup,
  aggregatePagination,
  projectCreatedAndUpdated,
  saveCreatedAtAndUpdatedAt,
  saveUpdatedAt,
} from '../../../common/mongodb/mongo.helper';
import { initAlarmMapper } from './alarm-mongo.mapper';

@Injectable()
export class MongoAlarmRepository implements AlarmRepository {
  private alarmModel: Promise<Collection>;

  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.alarmModel = mongodbClientProvider.getCollection(
      MongoCollections.ALARM,
    );
    initAlarmMapper();
  }

  private buildMatchQuery(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ) {
    const matchQuery: any = { namespace: options.namespace };

    if (query.search) {
      matchQuery.name = { $regex: query.search, $options: 'i' };
    }

    if (query.type) {
      matchQuery.type = query.type;
    }

    return matchQuery;
  }

  async find(
    query: any,
    page: number,
    limit: number,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity[]> {
    const collection = await this.alarmModel;
    const skip = (page - 1) * limit;

    const alarms = await collection
      .aggregate<MongoAlarmItem>([
        {
          $match: this.buildMatchQuery(query, options),
        },
        ...aggregatePagination(skip, limit),
        aggregateLookup(MongoCollections.USER, 'createdBy', '_id', 'createdBy'),
        aggregateLookup(MongoCollections.USER, 'updatedBy', '_id', 'updatedBy'),
        {
          $project: {
            ...projectCreatedAndUpdated(),
            _id: 1,
            type: 1,
            name: 1,
            description: 1,
            settings: 1,
            notifications: 1,
            schedule: 1,
            namespace: 1,
          },
        },
      ])
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
    return collection.countDocuments(this.buildMatchQuery(query, options));
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
      ...saveCreatedAtAndUpdatedAt(payload.createdBy),
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
          ...saveUpdatedAt(options.key),
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
