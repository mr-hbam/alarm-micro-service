import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectTrackerOfflineUseCase {
  async execute(payload: IPayload, options: Options): Promise<boolean> {
    let offlineTime = 0;

    const { timestamp, offlineThreshold, device, isOffline } = payload;

    if (!isOffline) {
      await this.clearStartTime(device);
      return false;
    }
    const driveTimeStart = await this.getStartTime(device);

    if (!driveTimeStart) {
      await this.saveStartTime(device, timestamp);
      return false;
    }
    switch (options.timeUnit) {
      case 'minutes':
        offlineTime =
          (new Date(timestamp).getTime() - new Date(driveTimeStart).getTime()) /
          (1000 * 60);
        break;
      case 'hours':
        offlineTime =
          (new Date(timestamp).getTime() - new Date(driveTimeStart).getTime()) /
          (1000 * 60 * 60);
        break;
      case 'seconds':
        offlineTime =
          (new Date(timestamp).getTime() - new Date(driveTimeStart).getTime()) /
          1000;
        break;

      default:
        break;
    }
    return offlineTime >= offlineThreshold;
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

  private async clearStartTime(device: string): Promise<void> {
    return;
  }
}

interface IPayload {
  isOffline: boolean;
  timestamp: string;
  device: string;
  offlineThreshold: number;
}

interface Options {
  timeUnit: 'minutes' | 'hours' | 'seconds';
}
