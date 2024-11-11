import { AlarmEntity } from '../../alarm/entities/alarm.entity';
import { CreateDetectionPayload } from './detection.type';

export interface DetectionRepository {
  deviceAlarms(unit: string): Promise<AlarmEntity[]>;
  createDetection(payload: CreateDetectionPayload): Promise<void>;
}
