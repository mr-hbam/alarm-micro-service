import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectExcessiveIdlingUsecase {
  async execute(payload: Payload): Promise<boolean> {
    const { isEngineRunning, isVehicleMoving, idelingTime, maxIdelingTime } =
      payload;

    if (!isEngineRunning || isVehicleMoving) {
      return false;
    }

    const maxId = maxIdelingTime - idelingTime;

    return maxId <= 0;
  }
}

interface Payload {
  isEngineRunning: boolean;
  isVehicleMoving: boolean;
  idelingTime: number;
  maxIdelingTime: number;
}
