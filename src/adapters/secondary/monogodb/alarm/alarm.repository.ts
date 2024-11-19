import { Injectable } from '@nestjs/common';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';
import { AlarmEntity } from '../../../../core/alarm/entities/alarm.entity';
import { AlarmRepository } from '../../../../core/alarm/repositories/alarm.repository';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../primaries/nest/alarm/dto/alarm.dto';
import { MongoCollections } from '../../common/mongodb/collections';
import { MongoFilterNamespaceOptionsType } from '../../common/type';

@Injectable()
export class MongoAlarmRepository implements AlarmRepository {
  private alarmModel: Promise<Collection>;
  private detectionModel: Promise<Collection>;
  private mongodbClientProvider: MongoDbClientProvider;
  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.alarmModel = mongodbClientProvider.getCollection(
      MongoCollections.ALARM,
    );
    this.detectionModel = mongodbClientProvider.getCollection(
      MongoCollections.DETECTION,
    );
    this.mongodbClientProvider = mongodbClientProvider;
  }

  //TODO Delete this after the test
  async getAlarmsForDevice(deviceKey: string): Promise<AlarmEntity[]> {
    const collection = await this.alarmModel;
    const unitObjectId = new ObjectId(deviceKey);

    const res = await collection
      .find<AlarmEntity>({
        unit: {
          $elemMatch: {
            key: unitObjectId,
          },
        },
      })
      .toArray();

    return res;
  }

  async createDetection(payload: any): Promise<void> {
    const collection = await this.detectionModel;
    const alarmId = new ObjectId(payload.alarmId);
    const session = await this.mongodbClientProvider.createSession();

    try {
      await session.startTransaction();
      const { insertedId } = await collection.insertOne(
        {
          namespace: payload.namespace,
          unit: payload.unit,
          device: payload.device,
          data: payload.data,
          alarm: {
            key: alarmId,
          },
          createdAt: new Date(),
        },
        { session },
      );
      const updateAlarm = await this.addDetectionToAlarm(
        insertedId,
        alarmId,
        session,
      );
      if (updateAlarm.modifiedCount) {
        await session.commitTransaction();
        return;
      }
      await session.abortTransaction();
      return;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
      return;
    }
  }

  private async addDetectionToAlarm(
    insertedId: ObjectId,
    alarmKey: ObjectId,
    session?: ClientSession,
  ) {
    const alarm = await this.alarmModel;

    return alarm.updateOne(
      { _id: alarmKey },
      {
        $addToSet: {
          detections: {
            key: insertedId,
            addedAt: new Date(),
          },
        },
      },
      { session },
    );
  }

  //End of the test

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
    { unitIds, ...payload }: CreateAlarmRequestDto,
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

    if (unitIds) {
      alarm['unit'] = unitIds.map((unitId) => ({ key: new ObjectId(unitId) }));
    }

    const result = await collection.insertOne(alarm);

    return {
      namespace: options.namespace,
      success: result.acknowledged,
    };
  }

  async updateAlarm(
    query: any,
    { unit, ...payload }: Partial<AlarmEntity>,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const collection = await this.alarmModel;
    const result = await collection.updateOne(
      { ...query, namespace: options.namespace },
      {
        $set: {
          ...payload,
          unit: unit.map((unitId) => ({ key: new ObjectId(unitId) })),
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
