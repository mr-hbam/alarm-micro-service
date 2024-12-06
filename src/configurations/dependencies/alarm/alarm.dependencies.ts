import { Provider } from '@nestjs/common';
import { GetAlarmTypesUseCase } from '../../../core/alarm/usecases/get-types.usecase';
import { GetAlarmTypeSettingsUseCase } from '../../../core/alarm/usecases/get-type-settings.usecase';
import { GetAlarmTypeNotificationsUseCase } from '../../../core/alarm/usecases/get-type-notifications.usecase';
import { CreateAlarmUseCase } from '../../../core/alarm/usecases/create-alarm.usecase';
import { FetchAlarmsUseCase } from '../../../core/alarm/usecases/fetch-alarms.usecase';
import { FetchAlarmUseCase } from '../../../core/alarm/usecases/fetch-alarm.usecase';
import { UpdateAlarmUseCase } from '../../../core/alarm/usecases/update-alarm.usecase';
import { DeleteAlarmUseCase } from '../../../core/alarm/usecases/delete-alarm.usecase';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';
import { MongoAlarmTypeRepository } from '../../../adapters/secondary/monogodb/alarm/mongo/type-mongo.repository';
import { MongoAlarmRepository } from '../../../adapters/secondary/monogodb/alarm/mongo/alarm-mongo.repository';
import { initAlarmMapper } from '../../../adapters/secondary/monogodb/alarm/mongo/alarm-mongo.mapper';
import { initAlarmTypeMapper } from '../../../adapters/secondary/monogodb/alarm/mongo/alarm-type-mongo.mapper';

export const AlarmUseCases: Provider[] = [
  {
    provide: GetAlarmTypesUseCase,
    useFactory: (repository: MongoAlarmTypeRepository) => {
      return new GetAlarmTypesUseCase(repository);
    },
    inject: [MongoAlarmTypeRepository],
  },
  {
    provide: GetAlarmTypeSettingsUseCase,
    useFactory: (repository: MongoAlarmTypeRepository) => {
      return new GetAlarmTypeSettingsUseCase(repository);
    },
    inject: [MongoAlarmTypeRepository],
  },
  {
    provide: GetAlarmTypeNotificationsUseCase,
    useFactory: (repository: MongoAlarmTypeRepository) => {
      return new GetAlarmTypeNotificationsUseCase(repository);
    },
    inject: [MongoAlarmTypeRepository],
  },
  {
    provide: FetchAlarmsUseCase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new FetchAlarmsUseCase(repository);
    },
    inject: [MongoAlarmRepository],
  },
  {
    provide: FetchAlarmUseCase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new FetchAlarmUseCase(repository);
    },
    inject: [MongoAlarmRepository],
  },
  {
    provide: CreateAlarmUseCase,
    useFactory: (
      alarmRepo: MongoAlarmRepository,
      typeRepo: MongoAlarmTypeRepository,
    ) => {
      return new CreateAlarmUseCase(alarmRepo, typeRepo);
    },
    inject: [MongoAlarmRepository, MongoAlarmTypeRepository],
  },
  {
    provide: UpdateAlarmUseCase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new UpdateAlarmUseCase(repository);
    },
    inject: [MongoAlarmRepository],
  },
  {
    provide: DeleteAlarmUseCase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new DeleteAlarmUseCase(repository);
    },
    inject: [MongoAlarmRepository],
  },
];

export const AlarmProviders: Provider[] = [
  {
    provide: MongoAlarmRepository,
    useFactory: (mongodbClientProvider: MongoDbClientProvider) =>
      new MongoAlarmRepository(mongodbClientProvider),
    inject: [MongoDbClientProvider],
  },
  {
    provide: MongoAlarmTypeRepository,
    useFactory: (mongodbClientProvider: MongoDbClientProvider) =>
      new MongoAlarmTypeRepository(mongodbClientProvider),
    inject: [MongoDbClientProvider],
  },
];

export const initAlarmMappers = () => {
  initAlarmMapper();
  initAlarmTypeMapper();
};

const alarmDependencies: Provider[] = [...AlarmProviders, ...AlarmUseCases];

export default alarmDependencies;
