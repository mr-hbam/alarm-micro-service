import { Injectable } from '@nestjs/common';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';
import { AlarmEntity } from '../../../../core/alarm/entities/alarm.entity';
import { AlarmTypeValue } from '../../../../core/alarm/type/type.enum';
import { DetectionRepository } from '../../../../core/detection/repositories/detection.repository';
import { CreateDetectionPayload } from '../../../../core/detection/repositories/detection.type';
import { MongoCollections } from '../../common/mongodb/collections';

@Injectable()
export class MongoDetectionRepository implements DetectionRepository {
  private detectionModel: Promise<Collection>;
  private alarmModel: Promise<Collection>;
  private mongodbClientProvider: MongoDbClientProvider;

  constructor(mongodbClientProvider: MongoDbClientProvider) {
    this.detectionModel = mongodbClientProvider.getCollection(
      MongoCollections.DETECTION,
    );
    this.mongodbClientProvider = mongodbClientProvider;
    this.alarmModel = mongodbClientProvider.getCollection(
      MongoCollections.ALARM,
    );
  }
  async deviceAlarms(unit: string): Promise<AlarmEntity[]> {
    //TODO implement this method
    // const collection = await this.alarmModel;
    // return collection.find<AlarmEntity>({ unit: unit }).toArray();
    return alarmMock;
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
      throw err;
    } finally {
      await session.endSession();
      return;
    }
  }
  //=================
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

const alarmMock: AlarmEntity[] = [
  {
    key: '671fab5ebde0aa4f7b41c96c',
    type: AlarmTypeValue.SPEEDING,
    name: 'Speeding (by hardware speed)',
    description: '',
    settings: {
      speed_limit: '51',
      bindzone: false,
    },
    notifications: {
      text: {
        notification_text: 'notification text 1',
      },
      emergency: false,
      push: false,
      recipients: {
        email: [],
        sms: [],
      },
    },
    schedule: {
      template: 'everyday',
      intervals: [
        {
          day: 'We',
          start: '05:00:00',
          end: '05:30:00',
        },
      ],
    },
    namespace: '123',
    createdAt: new Date('2024-10-28T16:07:37.050Z'),
    updatedAt: new Date('2024-10-28T16:07:37.050Z'),
  },
];
