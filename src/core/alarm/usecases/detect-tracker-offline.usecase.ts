import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectTrackerOfflineUseCase {
  async execute(payload: IPayload): Promise<boolean> {
    return payload.isOffline;
  }
}

interface IPayload {
  isOffline: boolean;
}
