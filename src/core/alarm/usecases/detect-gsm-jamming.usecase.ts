import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectGsmJammingUsecase {
  async execute(payload: Payload): Promise<boolean> {
    return payload.io249;
  }
}

interface Payload {
  io249: boolean;
}
