import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectExcessiveIdlingUsecase {
  async execute(payload: Payload): Promise<boolean> {
    const {
      isEngineRunning,
      engineRunningTime,
      isVehicleMoving,
      idelingTime,
      maxIdelingTime,
    } = payload;

    if (!isEngineRunning || isVehicleMoving) {
      return false;
    }

    const maxId = maxIdelingTime * 60 * 1000;

    return idelingTime >= maxId;
  }
}

interface Payload {
  isEngineRunning: boolean;
  engineRunningTime: number;
  isVehicleMoving: boolean;
  idelingTime: number;
  maxIdelingTime: number;
}

interface Options{
    
}
