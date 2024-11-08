import { NotFoundException } from '@nestjs/common';

export class AlarmNotFoundException extends NotFoundException {
  constructor(namespace: string) {
    super(`Alarm with key ${namespace} not found`);
  }
}
