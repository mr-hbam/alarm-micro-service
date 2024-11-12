import { Injectable } from '@nestjs/common';
import { AlarmTypeValue } from '../../alarm/type/type.enum';
import { isSpeeding } from '../helpers';
import { DetectionRepository } from '../repositories/detection.repository';
import { VerifyAlarmRequest } from '../type/type';

@Injectable()
export class VerifyAlarmUseCase {
  constructor(private readonly detectionRepository: DetectionRepository) {}

  async execute({
    data,
    device,
    namespace,
    unit,
  }: VerifyAlarmRequest): Promise<boolean> {
    const alarmDevices = await this.detectionRepository.deviceAlarms(device);

    if (!alarmDevices || alarmDevices.length === 0) {
      return false;
    }

    let detectedAlarms = 0;
    for (let index = 0; index < alarmDevices.length; index++) {
      const alarmDevice = alarmDevices[index];
      if (alarmDevice.type === AlarmTypeValue.SPEEDING) {
        if (isSpeeding(data, alarmDevice)) {
          await this.detectionRepository.createDetection({
            namespace,
            unit,
            device,
            data,
            alarmId: alarmDevice.key,
          });
          detectedAlarms++;
        }
      }
      if (alarmDevice.type === AlarmTypeValue.DEVIATION_FROM_ROUTE) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.DRIVING_TIME) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.EXCESSIVE_IDLING_HARDWARE) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.GPS_SIGNAL_LOST) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.GSM_JAMMING) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.LOW_BATTERY) {
        // Add your logic here
      }
      if (alarmDevice.type === AlarmTypeValue.TRACKER_OFFLINE) {
        // Add your logic here
      }
    }

    return detectedAlarms > 0;
  }
}
