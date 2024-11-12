import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectSpeedingUseCase {
  async execute(payload: Payload, options: Options): Promise<boolean> {
    if (!payload.isMoving) return false;

    if (options.useExternalSpeedLimit && payload.externalSpeedLimit) {
      return (
        payload.currentSpeed > payload.externalSpeedLimit + options.tolerance
      );
    } else {
      return payload.currentSpeed > payload.speedLimit + options.tolerance;
    }
  }
}

interface Payload {
  currentSpeed: number;
  speedLimit: number;
  isMoving: boolean;
  externalSpeedLimit?: number;
}
interface Options {
  tolerance: number;
  useExternalSpeedLimit: boolean;
}
