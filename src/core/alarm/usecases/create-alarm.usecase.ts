import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { AlarmTypeRepository } from '../repositories/type.repository';
import { AlarmTypeNotFoundException } from '../exceptions/type-not-found.exception';
import { InvalidAlarmDataException } from '../exceptions/invalid-alarm-data.exception';
import { UserRequest } from '../../common/type';
import { AlarmTypeValue } from '../type/type.enum';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from '../../../adapters/primaries/nest/alarm/dto/create-alarm.dto';

@Injectable()
export class CreateAlarmUseCase {
  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly alarmTypeRepository: AlarmTypeRepository,
  ) {}

  private validateSettings(type: AlarmTypeValue, settings: any): void {
    if (!settings) {
      throw new InvalidAlarmDataException('Settings are required');
    }

    switch (type) {
      case AlarmTypeValue.SPEEDING:
        if (
          typeof settings.speed_limit !== 'string' &&
          typeof settings.speed_limit !== 'number'
        ) {
          throw new InvalidAlarmDataException(
            'Speed limit setting must be a number for speeding alarm',
          );
        }
        this.validateGeofenceSettings(settings);
        break;
      // Add other alarm type validations...
    }
  }

  private validateGeofenceSettings(settings: any): void {
    if (settings.geofences && !Array.isArray(settings.geofences)) {
      throw new InvalidAlarmDataException(
        'If provided, geofences setting must be an array',
      );
    }
  }

  private validateNotifications(notifications: any): void {
    if (!notifications?.text?.notification_text?.trim()) {
      throw new InvalidAlarmDataException('Notification text is required');
    }

    if (typeof notifications.emergency !== 'boolean') {
      throw new InvalidAlarmDataException(
        'Emergency notification setting must be a boolean',
      );
    }

    if (typeof notifications.push !== 'boolean') {
      throw new InvalidAlarmDataException(
        'Push notification setting must be a boolean',
      );
    }

    this.validateRecipients(notifications.recipients);
  }

  private validateRecipients(recipients: any): void {
    if (recipients?.email?.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      recipients.email.forEach((recipient: any) => {
        if (recipient.value && !emailRegex.test(recipient.value.trim())) {
          throw new InvalidAlarmDataException(
            `Invalid email format: ${recipient.value}`,
          );
        }
      });
    }

    if (recipients?.sms?.length > 0) {
      recipients.sms.forEach((recipient: any) => {
        if (recipient.value && !/^\d+$/.test(recipient.value.trim())) {
          throw new InvalidAlarmDataException(
            `Invalid phone number format: ${recipient.value}`,
          );
        }
      });
    }
  }

  private validateSchedule(schedule: any): void {
    if (!schedule?.template) {
      throw new InvalidAlarmDataException('Schedule template is required');
    }

    if (!Array.isArray(schedule.intervals) || schedule.intervals.length === 0) {
      throw new InvalidAlarmDataException(
        'Schedule must contain at least one interval',
      );
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const validDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    for (const interval of schedule.intervals) {
      if (!interval.day || !interval.start || !interval.end) {
        throw new InvalidAlarmDataException(
          'Each schedule interval must contain day, start, and end times',
        );
      }

      if (!timeRegex.test(interval.start) || !timeRegex.test(interval.end)) {
        throw new InvalidAlarmDataException(
          'Invalid time format in schedule. Use HH:mm:ss format',
        );
      }

      if (!validDays.includes(interval.day)) {
        throw new InvalidAlarmDataException(
          'Invalid day format in schedule. Use Mo, Tu, We, Th, Fr, Sa, or Su',
        );
      }
    }
  }

  async execute(
    payload: CreateAlarmRequestDto,
    userRequest: UserRequest,
  ): Promise<CreateAlarmResponseDto> {
    const alarmType = await this.alarmTypeRepository.findByValue(payload.type);
    if (!alarmType) {
      throw new AlarmTypeNotFoundException(payload.type);
    }

    this.validateSettings(payload.type, payload.settings);
    this.validateNotifications(payload.notifications);
    this.validateSchedule(payload.schedule);

    const cleanPayload = {
      ...payload,
      namespace: userRequest.namespace,
      createdBy: userRequest.key,
      updatedBy: userRequest.key,
    };

    return this.alarmRepository.createAlarm(cleanPayload);
  }
}
