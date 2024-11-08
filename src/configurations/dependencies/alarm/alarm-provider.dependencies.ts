import { Provider } from '@nestjs/common';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';
import { MongoAlarmTypeRepository } from '../../../adapters/secondary/monogodb/alarm/type.repository';
import { MongoAlarmRepository } from '../../../adapters/secondary/monogodb/alarm/alarm.repository';

export const AlarmRepositoriesProviders: Provider[] = [
  {
    provide: MongoAlarmTypeRepository,
    useFactory: (mongodbClientProvider: MongoDbClientProvider) =>
      new MongoAlarmTypeRepository(mongodbClientProvider),
    inject: [MongoDbClientProvider],
  },
  {
    provide: MongoAlarmRepository,
    useFactory: (mongodbClientProvider: MongoDbClientProvider) =>
      new MongoAlarmRepository(mongodbClientProvider),
    inject: [MongoDbClientProvider],
  },
];
