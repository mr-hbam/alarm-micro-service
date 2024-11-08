import { Injectable } from '@nestjs/common';
import { AlarmTypeRepository } from '../repositories/type.repository';
import { AlarmTypeValue } from '../type/type.enum';
import { AlarmTypeSettingsResponse } from '../type/type.type';

@Injectable()
export class GetAlarmTypeSettingsUseCase {
  constructor(private readonly alarmTypeRepository: AlarmTypeRepository) {}

  async execute(
    typeValue: AlarmTypeValue,
  ): Promise<AlarmTypeSettingsResponse[]> {
    const type = await this.alarmTypeRepository.findByValue(typeValue);
    if (!type) {
      return [];
    }
    return type.settings.data;
  }
}
