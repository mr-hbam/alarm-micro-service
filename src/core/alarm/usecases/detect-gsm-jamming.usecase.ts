import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectGsmJammingUsecase {
  async execute(payload: Payload): Promise<boolean> {
    const { signalStrength, signalQuality } = payload;

    const signalStrengthThreshold = -110;
    const signalQualityThreshold = 10;

    if (
      signalStrength < signalStrengthThreshold &&
      signalQuality < signalQualityThreshold
    ) {
      return true;
    }

    return false;
  }
}

interface Payload {
  signalStrength: number;
  signalQuality: number;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}
