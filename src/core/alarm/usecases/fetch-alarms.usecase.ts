import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import {
  FetchAlarmsRequestDto,
  FetchAlarmsResponseDto,
  FetchAlarmItemDto,
} from '../../../adapters/primaries/nest/alarm/dto/fetch-alarms.dto';
import { AlarmEntity } from '../entities/alarm.entity';

@Injectable()
export class FetchAlarmsUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  private transformAlarmToDto(alarm: AlarmEntity): FetchAlarmItemDto {
    return {
      key: alarm.key,
      type: alarm.type,
      name: alarm.name,
      description: alarm.description,
      settings: alarm.settings,
      notifications: alarm.notifications,
      schedule: alarm.schedule,
      namespace: alarm.namespace,
      createdBy: alarm.createdBy,
      updatedBy: alarm.updatedBy,
      updatedAt: alarm.updatedAt,
    };
  }

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

    return {
      data: alarms.map((alarm) => this.transformAlarmToDto(alarm)),
      total,
      page,
      limit,
    };
  }
}
