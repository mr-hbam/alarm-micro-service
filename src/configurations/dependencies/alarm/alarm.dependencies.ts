import { Provider } from '@nestjs/common';
import { GetAlarmTypesUseCase } from '../../../core/alarm/usecases/get-types.usecase';
import { MongoAlarmTypeRepository } from '../../../adapters/secondary/monogodb/alarm/type.repository';
import { GetAlarmTypeSettingsUseCase } from '../../../core/alarm/usecases/get-type-settings.usecase';
import { GetAlarmTypeNotificationsUseCase } from '../../../core/alarm/usecases/get-type-notifications.usecase';
import { CreateAlarmUseCase } from '../../../core/alarm/usecases/create-alarm.usecase';
import { FetchAlarmsUseCase } from '../../../core/alarm/usecases/fetch-alarms.usecase';
import { FetchAlarmUseCase } from '../../../core/alarm/usecases/fetch-alarm.usecase';
import { UpdateAlarmUseCase } from '../../../core/alarm/usecases/update-alarm.usecase';
import { DeleteAlarmUseCase } from '../../../core/alarm/usecases/delete-alarm.usecase';
import { MongoAlarmRepository } from '../../../adapters/secondary/monogodb/alarm/alarm.repository';
import { AlarmValidatorService } from '../../../adapters/primaries/nest/alarm/service/alarm-validator.service';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';

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
      validator: AlarmValidatorService,
    ) => {
      return new CreateAlarmUseCase(alarmRepo, typeRepo, validator);
    },
    inject: [
      MongoAlarmRepository,
      MongoAlarmTypeRepository,
      AlarmValidatorService,
    ],
  },
  {
    provide: UpdateAlarmUseCase,
    useFactory: (
      repository: MongoAlarmRepository,
      validator: AlarmValidatorService,
    ) => {
      return new UpdateAlarmUseCase(repository, validator);
    },
    inject: [MongoAlarmRepository, AlarmValidatorService],
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
  AlarmValidatorService,
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

const alarmDependencies: Provider[] = [...AlarmProviders, ...AlarmUseCases];

export default alarmDependencies;
