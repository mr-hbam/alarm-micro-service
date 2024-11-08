import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { DeleteRequestDto } from '../../../adapters/primaries/nest/common/dto/delete.dto';

@Injectable()
export class DeleteAlarmUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async execute(namespace: string, payload: DeleteRequestDto) {
    const key = payload.key;

    const result = await this.alarmRepository.deleteAlarm(
      { key: { $in: key.split(',') } },
      { namespace, key },
    );

    return {
      success: result,
      deletedCount: result ? 1 : 0,
    };
  }
}
