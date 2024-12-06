import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../adapters/primaries/nest/alarm/dto/create-alarm.dto';
import { MongoFilterNamespaceOptionsType } from '../../../adapters/secondary/common/type';
import { AlarmEntity } from '../entities/alarm.entity';

export interface AlarmRepository {
  find(
    query: any,
    page: number,
    limit: number,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity[]>;

  count(query: any, options: MongoFilterNamespaceOptionsType): Promise<number>;

  findAlarm(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity | null>;

  createAlarm(
    payload: CreateAlarmRequestDto & {
      namespace: string;
      createdBy: string;
      updatedBy: string;
    },
  ): Promise<CreateAlarmResponseDto>;

  updateAlarm(
    query: any,
    payload: Partial<AlarmEntity>,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ matchedCount: number; modifiedCount: number }>;

  deleteAlarm(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<boolean>;
}
