import { Provider } from '@nestjs/common';
import { MongoDetectionRepository } from '../../../adapters/secondary/monogodb/detection/detection.repository';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';

export const DetectionProviders: Provider[] = [
  {
    provide: MongoDetectionRepository,
    useFactory: (repository: MongoDbClientProvider) => {
      return new MongoDetectionRepository(repository);
    },
    inject: [MongoDbClientProvider],
  },
];

const detectionDependencies: Provider[] = [...DetectionProviders];

export default detectionDependencies;
