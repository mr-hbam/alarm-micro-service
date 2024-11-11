export interface DeviceData {
  timestamp: string;
  priority: number;
  position_latitude: number;
  position_longitude: number;
  position_altitude: number;
  position_orientation: number;
  position_satellites: number;
  position_speed: number;
  engine_ignition_status: boolean;
  movement_status: boolean;
  gsm_signal: number;
  io_69: number;
  io_1: number;
  io_82: number;
  device_voltage: number;
  io_24: number;
  battery_voltage: number;
  io_85: number;
  io_241: number;
  io_16: number;
  io_107: number;
  io_78: string;
  fuel_consumption: number;
  rpm: number;
  assignment_passenger: number;
}

export interface VerifyAlarmRequest {
  namespace: string;
  unit: string;
  device: string;
  data: DeviceData;
}
