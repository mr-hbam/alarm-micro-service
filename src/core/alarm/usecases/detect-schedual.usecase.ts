import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectLowBatteryUseCase {
  async execute(payload: Payload): Promise<boolean> {
    const date = new Date(payload.detectionDate);
    const dayName = date
      .toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
      .slice(0, 2);
    if (payload.schedule.template === 'everyday') {
      return true;
    } else if (payload.schedule.template === 'weekdays') {
      return dayName !== 'Sa' && dayName !== 'Su';
    } else if (payload.schedule.template === 'weekends') {
      return dayName === 'Sa' || dayName === 'Su';
    }
    const detectionTime = date.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: 'UTC',
    });

    const interval = payload.schedule.intervals.filter(
      (interval) => interval.day === dayName,
    );

    if (interval.length === 0) {
      return false;
    }

    const isInInterval = interval.some((interval) =>
      isTimeInInterval(detectionTime, interval.start, interval.end),
    );
    return isInInterval;
  }
}

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

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

interface Schedule {
  template: 'everyday' | 'weekdays' | 'weekends' | 'custom';
  intervals: {
    day: string;
    start: string;
    end: string;
  }[];
}

interface Payload {
  schedule: Schedule;
  detectionDate: string;
}
