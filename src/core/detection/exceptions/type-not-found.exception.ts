import { NotFoundException } from '@nestjs/common';

export class AlarmTypeNotFoundException extends NotFoundException {
  constructor(typeValue: string) {
    super(`Alarm type with value ${typeValue} not found`);
  }
}
