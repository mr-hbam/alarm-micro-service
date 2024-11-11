import { Provider } from '@nestjs/common';
import { DetectionProviders } from './detection-provider.dependencies';
import { DetectionUseCases } from './detection.dependencies';

const alarmDependencies: Provider[] = [
  ...DetectionUseCases,
  ...DetectionProviders,
];

export default alarmDependencies;
