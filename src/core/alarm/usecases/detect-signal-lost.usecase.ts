import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectSignalLostUseCase {
  async execute(payload: IPayload): Promise<boolean> {
    return payload.currentSignal < payload.minSignal;
  }
}

interface IPayload {
  currentSignal: number;
  minSignal: number;
}
