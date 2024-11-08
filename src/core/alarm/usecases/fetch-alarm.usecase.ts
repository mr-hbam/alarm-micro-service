import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { AlarmEntity } from '../entities/alarm.entity';

@Injectable()
export class FetchAlarmUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async execute(key: string, namespace: string): Promise<AlarmEntity | null> {
    return this.alarmRepository.findAlarm({ key }, { namespace, key });
  }
}
