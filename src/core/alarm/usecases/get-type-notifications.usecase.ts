import { Injectable } from '@nestjs/common';
import { AlarmTypeRepository } from '../repositories/type.repository';
import { AlarmTypeValue } from '../type/type.enum';
import { AlarmTypeNotificationsResponse } from '../type/type.type';

@Injectable()
export class GetAlarmTypeNotificationsUseCase {
  constructor(private readonly alarmTypeRepository: AlarmTypeRepository) {}

  async execute(
    typeValue: AlarmTypeValue,
  ): Promise<AlarmTypeNotificationsResponse[]> {
    const type = await this.alarmTypeRepository.findByValue(typeValue);
    if (!type) {
      return [];
    }
    return type.notifications.data;
  }
}
