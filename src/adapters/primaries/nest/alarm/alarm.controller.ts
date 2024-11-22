import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlarmNotFoundException } from '../../../../core/alarm/exceptions/alarm-not-found.exception';
import { AlarmTypeNotFoundException } from '../../../../core/alarm/exceptions/type-not-found.exception';
import { AlarmTypeValue } from '../../../../core/alarm/type/type.enum';
import {
  AlarmTypeNotificationsResponse,
  AlarmTypeSettingsResponse,
} from '../../../../core/alarm/type/type.type';
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
  Schedule,
  UpdateAlarmUseCase,
} from '../../../../core/alarm/usecases';
import { UpdateResponse } from '../../../../core/common/repository/global.repository';
import { UserRequest } from '../../../../core/common/type';
import { CheckPolicies } from '../auth/decorators/policies.decorator';
import { UserRequestDecorator } from '../auth/decorators/user.decorator';
import { PoliciesGuard } from '../auth/guards';
import { NamespaceJwtAuthGuard } from '../auth/guards/namespace-jwt-auth.guard';
import {
  canCreateAlarm,
  canDeleteAlarm,
  canReadAlarm,
  canUpdateAlarm,
} from '../casl/check-abilities/alarm.abilities';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
  UpdateAlarmRequestDto,
} from './dto/alarm.dto';
import { DeleteRequestDto } from './dto/delete-alarm.dto';
import { DetectionDto } from './dto/detection.dto';
import { FetchAlarmRequestDto } from './dto/fetch-alarm.dto';
import {
  FetchAlarmsRequestDto,
  FetchAlarmsResponseDto,
} from './dto/fetch-alarms.dto';
import { FetchAlarmTypesResponseDto } from './dto/fetch-types.dto';
import { AlarmTypeParamDto } from './dto/type.dto';

@Controller('alarms')
export class AlarmTypesController {
  constructor(
    private readonly fetchAlarmsUseCase: FetchAlarmsUseCase,
    private readonly createDetectionUseCase: CreateDetectionUseCase,
    private readonly fetchAlarmUseCase: FetchAlarmUseCase,
    private getAlarmTypesUseCase: GetAlarmTypesUseCase,
    private getAlarmTypeSettingsUseCase: GetAlarmTypeSettingsUseCase,
    private getAlarmTypeNotificationsUseCase: GetAlarmTypeNotificationsUseCase,
    private createAlarmUseCase: CreateAlarmUseCase,
    private updateAlarmUseCase: UpdateAlarmUseCase,
    private deleteAlarmsUseCase: DeleteAlarmUseCase,
    private detectDrivingTimeUsecase: DetectDrivingTimeUsecase,
    private detectExcessiveIdlingUsecase: DetectExcessiveIdlingUsecase,
    private detectGsmJammingUsecase: DetectGsmJammingUsecase,
    private detectLowBatteryUseCase: DetectLowBatteryUseCase,
    private detectScheduleUsecase: DetectScheduleUsecase,
    private detectSignalLostUseCase: DetectSignalLostUseCase,
    private detectSpeedingUseCase: DetectSpeedingUseCase,
    private getDeviceAlarmUsecase: GetDeviceAlarmUsecase,
    private detectTrackerOfflineUseCase: DetectTrackerOfflineUseCase,
  ) {}

  //TODO remove this after testing
  @Post('detection')
  async detection(@Body() payload: DetectionDto) {
    const alarmsForDevice = await this.getDeviceAlarmUsecase.execute(
      payload.device,
    );

    for (const alarm of alarmsForDevice) {
      const alarmId = alarm['_id'].toString();
      let isConditionMet = false;
      switch (alarm.type) {
        case AlarmTypeValue.DRIVING_TIME:
          isConditionMet = await this.detectDrivingTimeUsecase.execute(
            {
              device: payload.device,
              drivingTimeThreshold: Number(alarm.settings.ADT),
              parkingTimeThreshold: Number(alarm.settings.MPTR),
              isMoving: payload.data.movement_status,
              timestamp: payload.data.timestamp,
            },
            { timeUnit: 'minutes' },
          );
          break;

        case AlarmTypeValue.TRACKER_OFFLINE:
          isConditionMet = await this.detectTrackerOfflineUseCase.execute(
            {
              device: payload.device,
              offlineThreshold: alarm.settings.OTMT,
              isOffline: payload.data.offline,
              timestamp: payload.data.timestamp,
            },
            { timeUnit: 'minutes' },
          );
          break;

        case AlarmTypeValue.SPEEDING:
          isConditionMet = await this.detectSpeedingUseCase.execute(
            {
              currentSpeed: payload.data.position_speed,
              isMoving: payload.data.movement_status,
              speedLimit: Number(alarm.settings.speed_limit),
            },
            {
              tolerance: 0,
              useExternalSpeedLimit: !!alarm.settings.external_speed_limit,
            },
          );
          break;

        case AlarmTypeValue.EXCESSIVE_IDLING_HARDWARE:
          isConditionMet = await this.detectExcessiveIdlingUsecase.execute(
            {
              device: payload.device,
              isMoving: payload.data.movement_status,
              timestamp: payload.data.timestamp,
              isEngineRunning: payload.data.engine_ignition_status,
              maxIdelingTime: 60,
            },
            { timeUnit: 'minutes' },
          );
          break;

        case AlarmTypeValue.GSM_JAMMING:
          isConditionMet = await this.detectGsmJammingUsecase.execute({
            io249: payload.data.io_249 === 1,
          });
          break;

        case AlarmTypeValue.LOW_BATTERY:
          isConditionMet = await this.detectLowBatteryUseCase.execute({
            deviceVoltage: payload.data.battery_voltage,
            minVoltage: 500,
          });
          break;

        case AlarmTypeValue.GPS_SIGNAL_LOST:
          isConditionMet = await this.detectSignalLostUseCase.execute({
            currentSignal: payload.data.gsm_signal,
            minSignal: 100,
          });
          break;

        default:
          isConditionMet = false;
          break;
      }

      if (isConditionMet) {
        const schedule = alarm.schedule as Schedule;
        const isInSchedule = await this.detectScheduleUsecase.execute({
          detectionDate: payload.data.timestamp,
          schedule: schedule,
        });

        if (isInSchedule) {
          await this.createDetectionUseCase.execute(
            {
              namespace: payload.namespace,
              unit: payload.unit,
              device: payload.device,
              data: payload.data,
            },
            alarmId,
          );
        }
      }
    }
  }

  @UseGuards(NamespaceJwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canReadAlarm)
  @Get()
  async fetchAlarms(
    @UserRequestDecorator() user: UserRequest,
    @Query() params: FetchAlarmsRequestDto,
  ): Promise<FetchAlarmsResponseDto> {
    return this.fetchAlarmsUseCase.execute(user.namespace, params);
  }

  @UseGuards(NamespaceJwtAuthGuard)
  @Get('types')
  async getAlarmTypes(): Promise<FetchAlarmTypesResponseDto[]> {
    return this.getAlarmTypesUseCase.execute();
  }

  @UseGuards(NamespaceJwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canReadAlarm)
  @Get(':key')
  async fetchOne(
    @UserRequestDecorator() user: UserRequest,
    @Param() payload: FetchAlarmRequestDto,
  ) {
    return this.fetchAlarmUseCase.execute(user.namespace, payload.key);
  }

  @UseGuards(NamespaceJwtAuthGuard)
  @Get(':type/settings')
  async getAlarmTypeSettings(
    @Param() params: AlarmTypeParamDto,
  ): Promise<AlarmTypeSettingsResponse[]> {
    const settings = await this.getAlarmTypeSettingsUseCase.execute(
      params.type,
    );
    if (settings.length === 0) {
      throw new AlarmTypeNotFoundException(params.type);
    }
    return settings;
  }

  @UseGuards(NamespaceJwtAuthGuard)
  @Get(':type/notifications')
  async getAlarmTypeNotifications(
    @Param() params: AlarmTypeParamDto,
  ): Promise<AlarmTypeNotificationsResponse[]> {
    const notifications = await this.getAlarmTypeNotificationsUseCase.execute(
      params.type,
    );
    if (notifications.length === 0) {
      throw new AlarmTypeNotFoundException(params.type);
    }
    return notifications;
  }

  @UseGuards(NamespaceJwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canCreateAlarm)
  @Post()
  @UseGuards(NamespaceJwtAuthGuard)
  async createAlarm(
    @Body() createAlarmDto: CreateAlarmRequestDto,
    @UserRequestDecorator() user: UserRequest,
  ): Promise<CreateAlarmResponseDto> {
    return this.createAlarmUseCase.execute(createAlarmDto, {
      key: user.key,
      namespace: user.namespace,
    });
  }

  @UseGuards(NamespaceJwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canUpdateAlarm)
  @Patch(':key')
  async updateAlarm(
    @UserRequestDecorator() user: UserRequest,
    @Body() alarm: UpdateAlarmRequestDto,
    @Param() payload: FetchAlarmRequestDto,
  ): Promise<UpdateResponse> {
    const alarmResult = await this.fetchAlarmUseCase.execute(
      user.namespace,
      payload.key,
    );

    if (alarmResult == null) {
      throw new AlarmNotFoundException(payload.key);
    }

    return this.updateAlarmUseCase.execute(user.namespace, payload.key, {
      ...alarm,
      type: alarmResult.type,
    });
  }

  @UseGuards(NamespaceJwtAuthGuard, PoliciesGuard)
  @CheckPolicies(canDeleteAlarm)
  @Delete()
  async deleteAlarms(
    @UserRequestDecorator() user: UserRequest,
    @Query() payload: DeleteRequestDto,
  ) {
    try {
      const result = await this.deleteAlarmsUseCase.execute(
        user.namespace,
        payload,
      );

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to delete alarms');
    }
  }
}
