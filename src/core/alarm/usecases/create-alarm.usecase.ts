import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { AlarmTypeRepository } from '../repositories/type.repository';
import { MongoFilterNamespaceOptionsType } from '../../../adapters/secondary/common/type';
import { AlarmTypeNotFoundException } from '../exceptions/type-not-found.exception';
import { AlarmValidatorService } from '../../../adapters/primaries/nest/alarm/service/alarm-validator.service';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../adapters/primaries/nest/alarm/dto/alarm.dto';

@Injectable()
export class CreateAlarmUseCase {
  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly alarmTypeRepository: AlarmTypeRepository,
    private readonly alarmValidator: AlarmValidatorService,
  ) {}

  async execute(
    payload: CreateAlarmRequestDto,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<CreateAlarmResponseDto> {
    const alarmType = await this.alarmTypeRepository.findByValue(payload.type);
    if (!alarmType) {
      throw new AlarmTypeNotFoundException(payload.type);
    }
    const cleanPayload = this.alarmValidator.cleanAndValidatePayload(
      payload.type,
      payload,
    );
    return this.alarmRepository.createAlarm(cleanPayload, options);
  }
}
