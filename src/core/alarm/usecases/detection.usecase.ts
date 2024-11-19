import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { AlarmTypeValue } from '../type/type.enum';
import { DetectDrivingTimeUsecase } from './detect-driving-time.usecase';
import { DetectExcessiveIdlingUsecase } from './detect-excessive-idling.usecase';
import { DetectGsmJammingUsecase } from './detect-gsm-jamming.usecase';
import { DetectLowBatteryUseCase } from './detect-low-battery.usecase';
import { DetectSchedualUsecase, Schedule } from './detect-schedual.usecase';
import { DetectSignalLostUseCase } from './detect-signal-lost.usecase';
import { DetectSpeedingUseCase } from './detect-speeding-usecase';
import { DetectTrackerOfflineUseCase } from './detect-tracker-offline.usecase';

@Injectable()
export class DetectionUseCase {
  constructor(
    private AlarmRepository: AlarmRepository,
    private readonly detectDrivingTimeUsecase: DetectDrivingTimeUsecase,
    private readonly detectExcessiveIdlingUsecase: DetectExcessiveIdlingUsecase,
    private readonly detectGsmJammingUsecase: DetectGsmJammingUsecase,
    private readonly detectLowBatteryUseCase: DetectLowBatteryUseCase,
    private readonly detectSchedualUsecase: DetectSchedualUsecase,
    private readonly detectSignalLostUseCase: DetectSignalLostUseCase,
    private readonly detectSpeedingUseCase: DetectSpeedingUseCase,
    private readonly detectTrackerOfflineUseCase: DetectTrackerOfflineUseCase,
  ) {}

  async execute(paylaod: Paylaod) {
    console.log('detection usecase');
    const alarmForDevice = await this.AlarmRepository.getAlarmsForDevice(
      paylaod.device,
    );

    for (let index = 0; index < alarmForDevice.length; index++) {
      const alarm = alarmForDevice[index];

      if (alarm.type === AlarmTypeValue.DRIVING_TIME) {
        const isDrivingTime = this.detectDrivingTimeUsecase.execute(
          {
            device: paylaod.device,
            drivingTimeThreshold: alarm.settings.drivingTimeThreshold,
            isMoving: paylaod.data.movement_status,
            timestamp: paylaod.data.timestamp,
          },
          {
            timeUnit: 'minutes',
          },
        );

        if (isDrivingTime) {
          const schedule = alarm.schedule as Schedule;
          const isInSchedual = this.detectSchedualUsecase.execute({
            detectionDate: paylaod.data.timestamp,
            schedule: schedule,
          });
          if (isInSchedual) {
            await this.AlarmRepository.createDetection({
              namespace: paylaod.namespace,
              unit: paylaod.unit,
              device: paylaod.device,
              data: paylaod.data,
              alarmId: alarm.key,
            });
          }
        }
      }

      if (alarm.type === AlarmTypeValue.TRACKER_OFFLINE) {
        const isOffline = this.detectTrackerOfflineUseCase.execute(
          {
            device: paylaod.device,
            offlineThreshold: alarm.settings.OTMT,
            isOffline: paylaod.data.movement_status,
            timestamp: paylaod.data.timestamp,
          },
          {
            timeUnit: 'minutes',
          },
        );

        if (isOffline) {
          const schedule = alarm.schedule as Schedule;
          const isInSchedual = this.detectSchedualUsecase.execute({
            detectionDate: paylaod.data.timestamp,
            schedule: schedule,
          });
          if (isInSchedual) {
            await this.AlarmRepository.createDetection({
              namespace: paylaod.namespace,
              unit: paylaod.unit,
              device: paylaod.device,
              data: paylaod.data,
              alarmId: alarm.key,
            });
          }
        }
      }
    }
    console.log(alarmForDevice);
  }
}

interface Paylaod {
  namespace: string;
  unit: string;
  device: string;
  data: {
    timestamp: string;
    priority: number;
    position_latitude: number;
    position_longitude: number;
    position_altitude: number;
    position_orientation: number;
    position_satellites: number;
    position_speed: number;
    engine_ignition_status: boolean;
    movement_status: boolean;
    gsm_signal: number;
    io_69: number;
    io_1: number;
    io_82: number;
    device_voltage: number;
    io_24: number;
    battery_voltage: number;
    io_85: number;
    io_241: number;
    io_16: number;
    io_107: number;
    io_78: string;
    fuel_consumption: number;
    rpm: number;
    assignment_passenger: number;
  };
}
