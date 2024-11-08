import { IsEnum } from 'class-validator';
import { AlarmTypeValue } from '../../../../../core/alarm/type/type.enum';

export class AlarmTypeParamDto {
  @IsEnum(AlarmTypeValue)
  type!: AlarmTypeValue;
}
