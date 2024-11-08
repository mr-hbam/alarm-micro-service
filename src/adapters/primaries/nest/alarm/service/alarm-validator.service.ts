import { Injectable, Logger } from '@nestjs/common';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';
import { InvalidAlarmDataException } from '../../../../../core/alarm/exceptions/invalid-alarm-data.exception';

@Injectable()
export class AlarmValidatorService {
  private readonly logger = new Logger(AlarmValidatorService.name);

  private removeNullValues(
    obj: Record<string, any> | null | undefined,
  ): Record<string, any> {
    if (!obj || typeof obj !== 'object') {
      return {};
    }

    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          result[key] = value;
        }
      } else if (typeof value === 'object') {
        const cleaned = this.removeNullValues(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  cleanAndValidatePayload(type: AlarmTypeValue, payload: any): any {
    if (!payload) {
      throw new InvalidAlarmDataException(
        'Payload cannot be null or undefined',
      );
    }

    if (!payload.settings) {
      throw new InvalidAlarmDataException('Settings are required');
    }

    if (!payload.notifications) {
      throw new InvalidAlarmDataException('Notifications are required');
    }

    const cleanPayload = {
      ...payload,
      settings: this.removeNullValues(payload.settings),
      notifications: {
        ...payload.notifications,
        text: this.removeNullValues(payload.notifications?.text),
        recipients: payload.notifications?.recipients
          ? {
              email:
                payload.notifications.recipients.email?.filter((e: any) =>
                  e?.value?.trim(),
                ) || [],
              sms:
                payload.notifications.recipients.sms?.filter((s: any) =>
                  s?.value?.trim(),
                ) || [],
            }
          : { email: [], sms: [] },
      },
    };

    this.validateSettings(type, cleanPayload.settings);
    this.validateNotifications(cleanPayload.notifications);
    this.validateSchedule(cleanPayload.schedule);

    return cleanPayload;
  }

  validateSettings(type: AlarmTypeValue, settings: any): void {
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
        this.validateGeofenceInOrOut(settings);
        break;

      case AlarmTypeValue.DEVIATION_FROM_ROUTE:
        if (typeof settings.DFR !== 'boolean') {
          throw new InvalidAlarmDataException(
            'DFR (Ignore Deviations) setting must be a boolean for deviation from route alarm',
          );
        }
        this.validateGeofenceInOrOut(settings);
        break;

      case AlarmTypeValue.TRACKER_OFFLINE:
        if (
          typeof settings.OTMT !== 'number' &&
          typeof settings.OTMT !== 'string'
        ) {
          throw new InvalidAlarmDataException(
            'OTMT (Offline time) setting must be a number for tracker offline alarm',
          );
        }
        break;

      case AlarmTypeValue.LOW_BATTERY:
        this.validateGeofence(settings);
        break;

      case AlarmTypeValue.GPS_SIGNAL_LOST:
        this.validateGeofenceInOrOut(settings);
        break;

      case AlarmTypeValue.GSM_JAMMING:
        this.validateGeofenceInOrOut(settings);
        break;

      case AlarmTypeValue.DRIVING_TIME:
        if (!settings.ADT) {
          throw new InvalidAlarmDataException(
            'ADT (Allowed driving time) setting is required for driving time alarm',
          );
        }
        if (!settings.MPTR) {
          throw new InvalidAlarmDataException(
            'MPTR (Minimum parking time for rest) setting is required for driving time alarm',
          );
        }
        this.validateGeofence(settings);
        break;

      case AlarmTypeValue.EXCESSIVE_IDLING_HARDWARE:
        this.validateGeofenceInOrOut(settings);
        break;
    }
  }

  private validateGeofence(settings: any): void {
    if (settings.geofences && !Array.isArray(settings.geofences)) {
      throw new InvalidAlarmDataException(
        'If provided, geofences setting must be an array',
      );
    }
  }

  private validateGeofenceInOrOut(settings: any): void {
    if (settings.geofences && !Array.isArray(settings.geofences)) {
      throw new InvalidAlarmDataException(
        'If provided, geofences setting must be an array',
      );
    }
  }

  validateNotifications(notifications: any): void {
    if (!notifications.text || Object.keys(notifications.text).length === 0) {
      throw new InvalidAlarmDataException(
        'Notification text configuration is required',
      );
    }

    if (!notifications.text.notification_text?.trim()) {
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

    if (notifications.recipients) {
      if (notifications.recipients.email?.length > 0) {
        this.validateEmailRecipients(notifications.recipients.email);
      }
      if (notifications.recipients.sms?.length > 0) {
        this.validateSmsRecipients(notifications.recipients.sms);
      }
    }
  }

  validateSchedule(schedule: any): void {
    if (!schedule?.template) {
      throw new InvalidAlarmDataException('Schedule template is required');
    }

    if (!Array.isArray(schedule.intervals) || schedule.intervals.length === 0) {
      throw new InvalidAlarmDataException(
        'Schedule must contain at least one interval',
      );
    }

    for (const interval of schedule.intervals) {
      if (!interval.day || !interval.start || !interval.end) {
        throw new InvalidAlarmDataException(
          'Each schedule interval must contain day, start, and end times',
        );
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      if (!timeRegex.test(interval.start) || !timeRegex.test(interval.end)) {
        throw new InvalidAlarmDataException(
          'Invalid time format in schedule. Use HH:mm:ss format',
        );
      }

      const validDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      if (!validDays.includes(interval.day)) {
        throw new InvalidAlarmDataException(
          'Invalid day format in schedule. Use Mo, Tu, We, Th, Fr, Sa, or Su',
        );
      }
    }
  }

  private validateEmailRecipients(emailRecipients: any[]): void {
    if (!Array.isArray(emailRecipients)) {
      throw new InvalidAlarmDataException('Email recipients must be an array');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailRecipients.forEach((recipient) => {
      if (recipient.value && !emailRegex.test(recipient.value.trim())) {
        throw new InvalidAlarmDataException(
          `Invalid email format: ${recipient.value}`,
        );
      }
    });
  }

  private validateSmsRecipients(smsRecipients: any[]): void {
    if (!Array.isArray(smsRecipients)) {
      throw new InvalidAlarmDataException('SMS recipients must be an array');
    }

    smsRecipients.forEach((recipient) => {
      if (recipient.value && !/^\d+$/.test(recipient.value.trim())) {
        throw new InvalidAlarmDataException(
          `Invalid phone number format: ${recipient.value}`,
        );
      }
    });
  }
}
