import { AlarmTypeRepository } from '../repositories/type.repository';

export interface AlarmTypeResponse {
  label: string;
  value: string;
}

export class GetAlarmTypesUseCase {
  constructor(private alarmTypeRepository: AlarmTypeRepository) {}

  public async execute(): Promise<AlarmTypeResponse[]> {
    const types = await this.alarmTypeRepository.findAll();

    return types.map((type) => ({
      label: type.label,
      value: type.value,
    }));
  }
}
