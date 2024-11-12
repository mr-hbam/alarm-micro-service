import { Injectable } from '@nestjs/common';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { mapper } from '../../../../common/mappings/mapper';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';
import { AlarmEntity } from '../../../../core/alarm/entities/alarm.entity';
import { DetectionRepository } from '../../../../core/detection/repositories/detection.repository';
import { CreateDetectionPayload } from '../../../../core/detection/repositories/detection.type';
import { MongoCollections } from '../../common/mongodb/collections';
import { initAlarmMapper } from './alarm-mongo.mapper';
import { FindAlarmItemResponse, MongoAlarmItem } from './type';

@Injectable()
export class MongoDetectionRepository implements DetectionRepository {
  private detectionModel: Promise<Collection>;
  private alarmModel: Promise<Collection>;
  private mongodbClientProvider: MongoDbClientProvider;

  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.detectionModel = mongodbClientProvider.getCollection(
      MongoCollections.DETECTION,
    );
    this.alarmModel = mongodbClientProvider.getCollection(
      MongoCollections.ALARM,
    );
    this.mongodbClientProvider = mongodbClientProvider;
    initAlarmMapper();
  }
  async deviceAlarms(unit: string): Promise<AlarmEntity[]> {
    //TODO implement this method
    const collection = await this.alarmModel;
    const unitObjectId = new ObjectId(unit);

    const res = await collection
      .find<MongoAlarmItem>({
        unit: {
          $elemMatch: {
            key: unitObjectId,
          },
        },
      })
      .toArray();

    const mappingRes = await this.mapMongoAlarmItemsToAlarmEntities(res);
    return mappingRes;
  }

  async createDetection(payload: CreateDetectionPayload): Promise<void> {
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
  //=================

  private async mapMongoAlarmItemsToAlarmEntities(
    mongoAlarmItems: MongoAlarmItem[],
  ): Promise<AlarmEntity[]> {
    return mongoAlarmItems.map((item) => {
      const alarmEntity = mapper.map<MongoAlarmItem, FindAlarmItemResponse>(
        item,
        MongoAlarmItem,
        FindAlarmItemResponse,
      );

      return alarmEntity;
    });
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
}
