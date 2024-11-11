import { AutoMap } from '@automapper/classes';
import { DeviceData, VerifyAlarmRequest } from '../type/type';

export class CreateDetectionPayload implements VerifyAlarmRequest {
  @AutoMap()
  namespace: string;

  @AutoMap()
  unit: string;

  @AutoMap()
  device: string;

  @AutoMap()
  data: DeviceData;

  @AutoMap()
  alarmId: string;
}
