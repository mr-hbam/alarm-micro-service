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
import {
  AlarmTypeNotificationsResponse,
  AlarmTypeSettingsResponse,
} from '../../../../core/alarm/type/type.type';
import { CreateAlarmUseCase } from '../../../../core/alarm/usecases/create-alarm.usecase';
import { DeleteAlarmUseCase } from '../../../../core/alarm/usecases/delete-alarm.usecase';
import { DetectionUseCase } from '../../../../core/alarm/usecases/detection.usecase';
import { FetchAlarmUseCase } from '../../../../core/alarm/usecases/fetch-alarm.usecase';
import { FetchAlarmsUseCase } from '../../../../core/alarm/usecases/fetch-alarms.usecase';
import { GetAlarmTypeNotificationsUseCase } from '../../../../core/alarm/usecases/get-type-notifications.usecase';
import { GetAlarmTypeSettingsUseCase } from '../../../../core/alarm/usecases/get-type-settings.usecase';
import { GetAlarmTypesUseCase } from '../../../../core/alarm/usecases/get-types.usecase';
import { UpdateAlarmUseCase } from '../../../../core/alarm/usecases/update-alarm.usecase';
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
    private readonly detectionUseCase: DetectionUseCase,
    private readonly fetchAlarmUseCase: FetchAlarmUseCase,
    private getAlarmTypesUseCase: GetAlarmTypesUseCase,
    private getAlarmTypeSettingsUseCase: GetAlarmTypeSettingsUseCase,
    private getAlarmTypeNotificationsUseCase: GetAlarmTypeNotificationsUseCase,
    private createAlarmUseCase: CreateAlarmUseCase,
    private updateAlarmUseCase: UpdateAlarmUseCase,
    private deleteAlarmsUseCase: DeleteAlarmUseCase,
  ) {}

  //TODO remove this after testing
  @Post('test')
  async testDetection(@Body() payload: DetectionDto) {
    return this.detectionUseCase.execute(payload);
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
