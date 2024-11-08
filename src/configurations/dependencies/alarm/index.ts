import { Provider } from '@nestjs/common';
import { AlarmUseCases } from './alarm.dependencies';
import { AlarmRepositoriesProviders } from './alarm-provider.dependencies';

const alarmDependencies: Provider[] = [
  ...AlarmRepositoriesProviders,
  ...AlarmUseCases,
];

export default alarmDependencies;
