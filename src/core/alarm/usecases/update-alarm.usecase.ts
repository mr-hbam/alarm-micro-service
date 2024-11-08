import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { AlarmValidatorService } from '../../../adapters/primaries/nest/alarm/service/alarm-validator.service';
import { UpdateResponse } from '../../common/repository/global.repository';
import { UpdateAlarmRequestDto } from '../../../adapters/primaries/nest/alarm/dto/alarm.dto';
import { AlarmTypeValue } from '../type/type.enum';

@Injectable()
export class UpdateAlarmUseCase {
  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly alarmValidator: AlarmValidatorService,
  ) {}

  async execute(
    namespace: string,
    key: string,
    payload: UpdateAlarmRequestDto & { type: AlarmTypeValue },
  ): Promise<UpdateResponse> {
    const cleanPayload = this.alarmValidator.cleanAndValidatePayload(
      payload.type,
      payload,
    );

    const result = await this.alarmRepository.updateAlarm(
      { key },
      cleanPayload,
      { namespace, key },
    );

    return {
      matchedCount: result.matchedCount,
      modified: result.modifiedCount > 0,
      modifiedCount: result.modifiedCount,
    };
  }
}
