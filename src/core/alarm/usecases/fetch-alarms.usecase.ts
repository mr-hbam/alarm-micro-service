import { Injectable } from '@nestjs/common';
import {
  FetchAlarmsRequestDto,
  FetchAlarmsResponseDto,
} from '../../../adapters/primaries/nest/alarm/dto/fetch-alarms.dto';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmRepository } from '../repositories/alarm.repository';

@Injectable()
export class FetchAlarmsUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async execute(
    namespace: string,
    params: FetchAlarmsRequestDto,
  ): Promise<FetchAlarmsResponseDto> {
    const { page = 1, limit = 10, search, type } = params;
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    const [alarms, total] = await Promise.all([
      this.alarmRepository.find(query, page, limit, { namespace, key: '' }),
      this.alarmRepository.count(query, { namespace, key: '' }),
    ]);
    const transformedData = alarms.map((alarm: AlarmEntity) => ({
      key: alarm.key,
      type: alarm.type,
      name: alarm.name,
      description: alarm.description,
      settings: alarm.settings,
      notifications: alarm.notifications,
      schedule: alarm.schedule,
      createdAt: alarm.createdAt,
      updatedAt: alarm.updatedAt,
      unit: alarm.unit,
    }));

    return {
      data: transformedData,
      total,
      page,
      limit,
    };
  }
}
