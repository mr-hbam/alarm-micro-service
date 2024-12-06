import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  Post,
  Body,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { NamespaceJwtAuthGuard } from '../auth/guards/namespace-jwt-auth.guard';
import { GetAlarmTypesUseCase } from '../../../../core/alarm/usecases/get-types.usecase';
import { GetAlarmTypeSettingsUseCase } from '../../../../core/alarm/usecases/get-type-settings.usecase';
import { GetAlarmTypeNotificationsUseCase } from '../../../../core/alarm/usecases/get-type-notifications.usecase';
import { FetchAlarmTypesResponseDto } from './dto/fetch-types.dto';
import {
  AlarmTypeNotificationsResponse,
  AlarmTypeSettingsResponse,
} from '../../../../core/alarm/type/type.type';
import { AlarmTypeParamDto } from './dto/type.dto';
import { CreateAlarmUseCase } from '../../../../core/alarm/usecases/create-alarm.usecase';
import { UserRequestDecorator } from '../auth/decorators/user.decorator';
import { UserRequest } from '../../../../core/common/type';
import { FetchAlarmsUseCase } from '../../../../core/alarm/usecases/fetch-alarms.usecase';
import { FetchAlarmUseCase } from '../../../../core/alarm/usecases/fetch-alarm.usecase';
import {
  FetchAlarmsRequestDto,
  FetchAlarmsResponseDto,
} from './dto/fetch-alarms.dto';
import { FetchAlarmRequestDto } from './dto/fetch-alarm.dto';
import { UpdateResponse } from '../../../../core/common/repository/global.repository';
import { UpdateAlarmUseCase } from '../../../../core/alarm/usecases/update-alarm.usecase';
import { DeleteAlarmUseCase } from '../../../../core/alarm/usecases/delete-alarm.usecase';
import { DeleteRequestDto } from './dto/delete-alarm.dto';
import { AlarmNotFoundException } from '../../../../core/alarm/exceptions/alarm-not-found.exception';
import { AlarmTypeNotFoundException } from '../../../../core/alarm/exceptions/type-not-found.exception';
import { PoliciesGuard } from '../auth/guards';
import { CheckPolicies } from '../auth/decorators/policies.decorator';
import {
  canCreateAlarm,
  canDeleteAlarm,
  canReadAlarm,
  canUpdateAlarm,
} from '../casl/check-abilities/alarm.abilities';
import {
  CreateAlarmRequestDto,
  CreateAlarmResponseDto,
} from './dto/create-alarm.dto';
import { UpdateAlarmRequestDto } from './dto/update-alarm.dto';

@Controller('alarms')
export class AlarmTypesController {
  constructor(
    private readonly fetchAlarmsUseCase: FetchAlarmsUseCase,
    private readonly fetchAlarmUseCase: FetchAlarmUseCase,
    private getAlarmTypesUseCase: GetAlarmTypesUseCase,
    private getAlarmTypeSettingsUseCase: GetAlarmTypeSettingsUseCase,
    private getAlarmTypeNotificationsUseCase: GetAlarmTypeNotificationsUseCase,
    private createAlarmUseCase: CreateAlarmUseCase,
    private updateAlarmUseCase: UpdateAlarmUseCase,
    private deleteAlarmsUseCase: DeleteAlarmUseCase,
  ) {}

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
  async createAlarm(
    @Body() createAlarmDto: CreateAlarmRequestDto,
    @UserRequestDecorator() user: UserRequest,
  ): Promise<CreateAlarmResponseDto> {
    // Passing the complete user object since UserRequest requires all properties
    return this.createAlarmUseCase.execute(createAlarmDto, user);
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

    return this.updateAlarmUseCase.execute(user, payload.key, {
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
      return await this.deleteAlarmsUseCase.execute(user.namespace, payload);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to delete alarms');
    }
  }
}
