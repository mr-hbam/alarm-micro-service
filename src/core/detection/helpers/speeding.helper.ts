import { AlarmEntity } from '../../alarm/entities/alarm.entity';
import { DeviceData, ISchedule, ISpeedingSetting } from '../type/type';
import { isInSchedule } from './schedule.helper';

export const isSpeeding = (data: DeviceData, alarm: AlarmEntity): boolean => {
  const isMoving = data.movement_status;
  if (!isMoving) {
    return false;
  }
  const settings = alarm.settings as ISpeedingSetting;
  const scheduale = alarm.schedule as ISchedule;
  const speed = data.position_speed;
  const speedLimit = settings.speed_limit || 0;

  if (!speedLimit || speedLimit === 0) {
    return false;
  }

  //TODO - Implement the logic to implement the geofence bindzone
  const isSpeeding = speed > speedLimit;
  if (isSpeeding) {
    //TODO - Implement the logic to send notifications
    // const notifications = alarm.notifications;
    const bindZone = settings.bindzone || false;
    const detectionDate = data.timestamp;
    const isDetectionInSchedule = isInSchedule(scheduale, detectionDate);
    if (!isDetectionInSchedule) {
      return false;
    }

    if (bindZone) {
      //TODO - Implement the logic to check if the detection is in the bindzone
    } else return true;
  }
  return false;
};
