import { AlarmEntity } from '../../alarm/entities/alarm.entity';
import { DeviceData } from '../type/type';

export const isSpeeding = (data: DeviceData, alarm: AlarmEntity): boolean => {
  const isMoving = data.movement_status;
  if (!isMoving) {
    return false;
  }

  const speed = data.position_speed;
  const speedLimit: number = alarm.settings['speed_limit'];

  if (!speedLimit) {
    return false;
  }

  //TODO - Implement the logic to implement the geofence bindzone
  const isSpeeding = speed > speedLimit;
  if (isSpeeding) {
    const scheduale = alarm.schedule as ISchedule;
    //TODO - Implement the logic to send notifications
    // const notifications = alarm.notifications;
    const detectionDate = data.timestamp; //2024-06-20T23:44:30.000Z
    const isDetectionInSchedule = isInSchedule(scheduale, detectionDate);
    if (!isDetectionInSchedule) {
      return false;
    }
    return true;
  }
  return false;
};

const isInSchedule = (schedule: ISchedule, detectionDate: string): boolean => {
  const date = new Date(detectionDate);
  const dayName = date
    .toLocaleDateString('en-US', { weekday: 'short' })
    .slice(0, 2);
  if (schedule.template === 'everyday') {
    return true;
  } else if (schedule.template === 'weekdays') {
    return dayName !== 'Sa' && dayName !== 'Su';
  } else if (schedule.template === 'weekends') {
    return dayName === 'Sa' || dayName === 'Su';
  }
  const detectionTime = date.toLocaleTimeString('en-US', {
    hour12: false,
  });
  const interval = schedule.intervals.filter(
    (interval) => interval.day === dayName,
  );

  if (interval.length === 0) {
    return false;
  }

  const isInInterval = interval.some((interval) =>
    isTimeInInterval(detectionTime, interval.start, interval.end),
  );
  return isInInterval;
};

const isTimeInInterval = (
  detectionTime: string,
  start: string,
  end: string,
): boolean => {
  const detectionTimeInMinutes = timeToMinutes(detectionTime);
  const startInMinutes = timeToMinutes(start);
  const endInMinutes = timeToMinutes(end);

  return (
    detectionTimeInMinutes >= startInMinutes &&
    detectionTimeInMinutes <= endInMinutes
  );
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
interface ISchedule {
  template: 'everyday' | 'weekdays' | 'weekends' | 'custom';
  intervals: {
    day: string;
    start: string;
    end: string;
  }[];
}
