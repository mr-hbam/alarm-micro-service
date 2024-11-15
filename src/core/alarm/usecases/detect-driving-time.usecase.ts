import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectDrivingTimeUsecase {
  async execute(payload: Payload, options: Options): Promise<boolean> {
    const { timestamp, drivingTimeThreshold, isMoving, device } = payload;
    const { timeUnit } = options;

    if (isMoving) {
      const startTime = await this.getStartTime(device);
      if (!startTime) {
        return false;
      }
      await this.resetTime(device);
      return this.calculateDrivingTime(
        payload,
        options,
        startTime,
        drivingTimeThreshold,
      );
    }
    const startTime = await this.getStartTime(device);

    if (!startTime) {
      await this.saveStartTime(device, timestamp);
      return false;
    }

    return this.calculateDrivingTime(
      payload,
      options,
      startTime,
      drivingTimeThreshold,
    );
  }

  private async calculateDrivingTime(
    { timestamp }: Payload,
    { timeUnit }: Options,
    startTime: string,
    drivingTimeThreshold: number,
  ): Promise<boolean> {
    let drivingTime = 0;
    switch (timeUnit) {
      case 'minutes':
        drivingTime =
          (new Date(timestamp).getTime() - new Date(startTime).getTime()) /
          (1000 * 60);
        break;
      case 'hours':
        drivingTime =
          (new Date(timestamp).getTime() - new Date(startTime).getTime()) /
          (1000 * 60 * 60);
        break;
      case 'seconds':
        drivingTime =
          (new Date(timestamp).getTime() - new Date(startTime).getTime()) /
          1000;
        break;

      default:
        break;
    }

    if (drivingTime > drivingTimeThreshold) {
      return true;
    }
    return false;
  }

  private async getStartTime(device: string): Promise<string> {
    return '2024-06-21T22:44:30.000Z';
  }

  private async saveStartTime(
    device: string,
    timestamp: string,
  ): Promise<void> {
    return;
  }

  private async resetTime(device: string): Promise<void> {
    return;
  }
}

interface Payload {
  timestamp: string;
  drivingTimeThreshold: number;
  isMoving: boolean;
  device: string;
}

interface Options {
  timeUnit: 'minutes' | 'hours' | 'seconds';
}
