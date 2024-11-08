import { MongoFilterNamespaceOptionsType } from '../../../adapters/secondary/common/type';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../adapters/primaries/nest/alarm/dto/alarm.dto';
import { AlarmEntity } from '../entities/alarm.entity';

export interface AlarmRepository {
  find(
    query: any,
    page: number,
    limit: number,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity[]>;
  findAlarm(
    query: any,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<AlarmEntity | null>;
  count(query: any, options: MongoFilterNamespaceOptionsType): Promise<number>;
  createAlarm(
    payload: CreateAlarmRequestDto,
    options: MongoFilterNamespaceOptionsType,
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
