import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

class DataDTO {
  @IsString()
  timestamp: string;

  @IsNumber()
  priority: number;

  @IsNumber()
  position_latitude: number;

  @IsNumber()
  position_longitude: number;

  @IsNumber()
  position_altitude: number;

  @IsNumber()
  position_orientation: number;

  @IsNumber()
  position_satellites: number;

  @IsNumber()
  position_speed: number;

  @IsBoolean()
  engine_ignition_status: boolean;

  @IsBoolean()
  movement_status: boolean;

  @IsNumber()
  gsm_signal: number;

  @IsNumber()
  io_69: number;

  @IsNumber()
  io_1: number;

  @IsNumber()
  io_82: number;

  @IsNumber()
  device_voltage: number;

  @IsNumber()
  io_24: number;

  @IsNumber()
  battery_voltage: number;

  @IsNumber()
  io_85: number;

  @IsNumber()
  io_241: number;

  @IsNumber()
  io_16: number;

  @IsNumber()
  io_107: number;

  @IsString()
  io_78: string;

  @IsNumber()
  fuel_consumption: number;

  @IsNumber()
  rpm: number;

  @IsNumber()
  assignment_passenger: number;
}

export class VerifyAlarmRequestDto {
  @IsString()
  namespace: string;

  @IsString()
  unit: string;

  @IsString()
  device: string;

  @IsObject()
  @Type(() => DataDTO)
  data: DataDTO;
}
