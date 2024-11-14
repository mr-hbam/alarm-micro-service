import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectDrivingTimeUsecase {
  async execute(payload: Payload): Promise<boolean> {
    const { startTime, endTime, drivingTimeThreshold } = payload;

    const drivingTime =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
      (1000 * 60);

    if (drivingTime > drivingTimeThreshold) {
      return true;
    }

    return false;
  }
}

interface Payload {
  startTime: string;
  endTime: string;
  drivingTimeThreshold: number;
}
