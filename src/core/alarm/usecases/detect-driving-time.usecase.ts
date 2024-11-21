import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectDrivingTimeUsecase {
  async execute(payload: Payload, options: Options): Promise<boolean> {
    const {
      timestamp,
      drivingTimeThreshold,
      isMoving,
      device,
      parkingTimeThreshold,
    } = payload;

    if (isMoving) {
      const startTime = await this.getStartTime(device);
      if (!startTime) {
        await this.saveStartTime(device, timestamp, isMoving);
        return false;
      }
      await this.resetTime(device);
      return this.calculateDrivingTime(
        payload,
        options,
        startTime,
        drivingTimeThreshold,
        device,
      );
    }
    const startTime = await this.getStartTime(device);

    if (!startTime) {
      await this.saveStartTime(device, timestamp, isMoving);
      return false;
    }
    return this.calculateDrivingTime(
      payload,
      options,
      startTime,
      parkingTimeThreshold,
      device,
    );
  }

  private async calculateDrivingTime(
    { timestamp }: Payload,
    { timeUnit }: Options,
    startTime: string,
    timeThreshold: number,
    device: string,
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
    await this.resetTime(device);

    if (drivingTime > timeThreshold) {
      return true;
    }
    return false;
  }

  private async getStartTime(device: string): Promise<string> {
    return '2024-06-21T00:44:30.000Z';
  }

  private async saveStartTime(
    device: string,
    timestamp: string,
    isMoving: boolean = false,
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
  parkingTimeThreshold: number;
}

interface Options {
  timeUnit: 'minutes' | 'hours' | 'seconds';
}
