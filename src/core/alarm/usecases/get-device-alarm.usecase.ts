import { Injectable } from '@nestjs/common';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmRepository } from '../repositories/alarm.repository';

@Injectable()
export class GetDeviceAlarmUsecase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async execute(key: string): Promise<AlarmEntity[] | null> {
    return this.alarmRepository.getAlarmsForDevice(key);
  }
}
