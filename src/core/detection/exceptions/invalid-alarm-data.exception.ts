import { BadRequestException } from '@nestjs/common';

export class InvalidAlarmDataException extends BadRequestException {
  constructor(message: string) {
    super(`Invalid alarm data: ${message}`);
  }
}
