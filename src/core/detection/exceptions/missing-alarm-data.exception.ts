import { BadRequestException } from '@nestjs/common';

export class MissingAlarmDataException extends BadRequestException {
  constructor(field: string) {
    super(`Missing required alarm data: ${field}`);
  }
}
