import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectLowBatteryUseCase {
  async execute(payload: IPayload): Promise<boolean> {
    return payload.deviceVoltage < payload.minVoltage;
  }
}

interface IPayload {
  deviceVoltage: number;
  minVoltage: number;
}
