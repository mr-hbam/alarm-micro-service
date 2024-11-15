import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectGsmJammingUsecase {
  async execute(payload: Payload): Promise<boolean> {
    if (payload.io249) await this.jamingStartingTime(payload);
    else await this.jamingEndingTime(payload);
    return payload.io249;
  }

  //implementation of jamingStartingTime and jamingEndingTime
  private async jamingStartingTime(payload: Payload) {
    return payload.io249;
  }

  private async jamingEndingTime(payload: Payload) {
    return payload.io249;
  }
}

interface Payload {
  timestamp: Date;
  io249: boolean;
}
