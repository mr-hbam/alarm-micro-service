import { MongoDetectionRepository } from '../../../adapters/secondary/monogodb/detection/detection.repository';
import { VerifyAlarmUseCase } from '../../../core/detection/usecases';

const CreateDetection = {
  provide: VerifyAlarmUseCase,
  useFactory: (DetectionRepository: MongoDetectionRepository) =>
    new VerifyAlarmUseCase(DetectionRepository),
  inject: [MongoDetectionRepository],
};

export const DetectionUseCases = [CreateDetection];
