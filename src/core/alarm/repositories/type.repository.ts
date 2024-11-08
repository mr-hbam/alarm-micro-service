import { AlarmTypeEntity } from '../entities/type.entity';
import { AlarmTypeValue } from '../type/type.enum';

export interface AlarmTypeRepository {
  findAll(): Promise<AlarmTypeEntity[]>;
  findByValue(value: AlarmTypeValue): Promise<AlarmTypeEntity | null>;
}
