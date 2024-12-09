import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../repositories/alarm.repository';
import { UpdateResponse } from '../../common/repository/global.repository';
import { AlarmTypeValue } from '../type/type.enum';
import { InvalidAlarmDataException } from '../exceptions/invalid-alarm-data.exception';
import { UserRequest } from '../../common/type';
import { UpdateAlarmRequestDto } from '../../../adapters/primaries/nest/alarm/dto/update-alarm.dto';

@Injectable()
export class UpdateAlarmUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  private validateUpdateSettings(type: AlarmTypeValue, settings?: any): void {
    if (!settings) return;

    switch (type) {
      case AlarmTypeValue.SPEEDING:
        if (
          settings.speed_limit !== undefined &&
          typeof settings.speed_limit !== 'string' &&
          typeof settings.speed_limit !== 'number'
        ) {
          throw new InvalidAlarmDataException(
            'Speed limit setting must be a number for speeding alarm',
          );
        }
        this.validateGeofenceSettings(settings);
        break;
    }
  }

  private validateGeofenceSettings(settings: any): void {
    if (settings.geofences && !Array.isArray(settings.geofences)) {
      throw new InvalidAlarmDataException(
        'If provided, geofences setting must be an array',
      );
    }
  }

  private validateUpdateNotifications(notifications?: any): void {
    if (!notifications) return;

    if (notifications.text) {
      if (
        notifications.text.notification_text &&
        !notifications.text.notification_text.trim()
      ) {
        throw new InvalidAlarmDataException(
          'Notification text cannot be empty',
        );
      }
    }

    if (
      notifications.emergency !== undefined &&
      typeof notifications.emergency !== 'boolean'
    ) {
      throw new InvalidAlarmDataException(
        'Emergency notification setting must be a boolean',
      );
    }

    if (
      notifications.push !== undefined &&
      typeof notifications.push !== 'boolean'
    ) {
      throw new InvalidAlarmDataException(
        'Push notification setting must be a boolean',
      );
    }

    if (notifications.email) {
      this.validateEmailRecipients(notifications.email);
    }

    if (notifications.sms) {
      this.validateSmsRecipients(notifications.sms);
    }
  }

  private validateEmailRecipients(recipients?: any[]): void {
    if (recipients?.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      recipients.forEach((recipient: any) => {
        if (recipient.value && !emailRegex.test(recipient.value.trim())) {
          throw new InvalidAlarmDataException(
            `Invalid email format: ${recipient.value}`,
          );
        }
      });
    }
  }

  private validateSmsRecipients(recipients?: any[]): void {
    if (recipients?.length > 0) {
      recipients.forEach((recipient: any) => {
        if (recipient.value && !/^\d+$/.test(recipient.value.trim())) {
          throw new InvalidAlarmDataException(
            `Invalid phone number format: ${recipient.value}`,
          );
        }
      });
    }
  }

  async execute(
    userRequest: UserRequest,
    key: string,
    payload: UpdateAlarmRequestDto & { type: AlarmTypeValue },
  ): Promise<UpdateResponse> {
    this.validateUpdateSettings(payload.type, payload.settings);
    this.validateUpdateNotifications(payload.notifications);

    const result = await this.alarmRepository.updateAlarm({ key }, payload, {
      namespace: userRequest.namespace,
      key: userRequest.key,
    });

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      modified: result.modifiedCount > 0,
    };
  }
}
