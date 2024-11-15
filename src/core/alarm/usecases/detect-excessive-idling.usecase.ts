import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectExcessiveIdlingUsecase {
  async execute(payload: Payload, options: Options): Promise<boolean> {
    const { isEngineRunning, isMoving, timestamp, maxIdelingTime, device } =
      payload;
    const { timeUnit } = options;
    if (!isEngineRunning || isMoving) {
      return false;
    }

    const idelingStartTime = await this.idelingTime(device);

    if (!idelingStartTime) {
      await this.saveIdelingTime(device, timestamp);
      return false;
    }
    let idelingTime = 0;
    switch (timeUnit) {
      case 'minutes':
        idelingTime =
          (new Date(timestamp).getTime() -
            new Date(idelingStartTime).getTime()) /
          (1000 * 60);
        break;
      case 'hours':
        idelingTime =
          (new Date(timestamp).getTime() -
            new Date(idelingStartTime).getTime()) /
          (1000 * 60 * 60);
        break;
      case 'seconds':
        idelingTime =
          (new Date(timestamp).getTime() -
            new Date(idelingStartTime).getTime()) /
          1000;
        break;

      default:
        break;
    }

    const maxId = maxIdelingTime - idelingTime;

    return maxId <= 0;
  }

  private async idelingTime(device: string): Promise<number> {
    return undefined;
  }

  private saveIdelingTime(device: string, timestamp: string): void {
    return;
  }
}

interface Payload {
  isEngineRunning: boolean;
  maxIdelingTime: number;
  isMoving: boolean;
  timestamp: string;
  device: string;
}

interface Options {
  timeUnit: 'minutes' | 'hours' | 'seconds';
}
