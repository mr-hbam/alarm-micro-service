import { Provider } from '@nestjs/common';
import { AlarmValidatorService } from '../../../adapters/primaries/nest/alarm/service/alarm-validator.service';
import { MongoAlarmRepository } from '../../../adapters/secondary/monogodb/alarm/alarm.repository';
import { MongoAlarmTypeRepository } from '../../../adapters/secondary/monogodb/alarm/type.repository';
import {
  CreateAlarmUseCase,
  CreateDetectionUseCase,
  DeleteAlarmUseCase,
  DetectDrivingTimeUsecase,
  DetectExcessiveIdlingUsecase,
  DetectGsmJammingUsecase,
  DetectLowBatteryUseCase,
  DetectScheduleUsecase,
  DetectSignalLostUseCase,
  DetectSpeedingUseCase,
  DetectTrackerOfflineUseCase,
  FetchAlarmsUseCase,
  FetchAlarmUseCase,
  GetAlarmTypeNotificationsUseCase,
  GetAlarmTypeSettingsUseCase,
  GetAlarmTypesUseCase,
  GetDeviceAlarmUsecase,
  UpdateAlarmUseCase,
} from '../../../core/alarm/usecases';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';

export const AlarmUseCases: Provider[] = [
  {
    provide: GetAlarmTypesUseCase,
    useFactory: (repository: MongoAlarmTypeRepository) => {
      return new GetAlarmTypesUseCase(repository);
    },
    inject: [MongoAlarmTypeRepository],
  },

  //TODO Delete this after the test
  {
    provide: GetDeviceAlarmUsecase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new GetDeviceAlarmUsecase(repository);
    },
    inject: [MongoAlarmRepository],
  },
  {
    provide: DetectDrivingTimeUsecase,
    useFactory: () => {
      return new DetectDrivingTimeUsecase();
    },
  },
  {
    provide: DetectExcessiveIdlingUsecase,
    useFactory: () => {
      return new DetectExcessiveIdlingUsecase();
    },
  },
  {
    provide: DetectGsmJammingUsecase,
    useFactory: () => {
      return new DetectGsmJammingUsecase();
    },
  },
  {
    provide: DetectLowBatteryUseCase,
    useFactory: () => {
      return new DetectLowBatteryUseCase();
    },
  },
  {
    provide: DetectScheduleUsecase,
    useFactory: () => {
      return new DetectScheduleUsecase();
    },
  },
  {
    provide: DetectSignalLostUseCase,
    useFactory: () => {
      return new DetectSignalLostUseCase();
    },
  },
  {
    provide: DetectSpeedingUseCase,
    useFactory: () => {
      return new DetectSpeedingUseCase();
    },
  },
  {
    provide: DetectTrackerOfflineUseCase,
    useFactory: () => {
      return new DetectTrackerOfflineUseCase();
    },
  },
  {
    provide: CreateDetectionUseCase,
    useFactory: (repository: MongoAlarmRepository) => {
      return new CreateDetectionUseCase(repository);
    },
    inject: [MongoAlarmRepository],
  },

  //TODO END
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
