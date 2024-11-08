export enum AlarmTypeValue {
  SPEEDING = 'speeding',
  DEVIATION_FROM_ROUTE = 'deviation_from_route',
  TRACKER_OFFLINE = 'tracker_offline',
  LOW_BATTERY = 'low_battery',
  GPS_SIGNAL_LOST = 'gps_signal_lost',
  GSM_JAMMING = 'gsm_jamming',
  DRIVING_TIME = 'driving_time',
  EXCESSIVE_IDLING_HARDWARE = 'excessive_idling_hardware',
}

export enum AlarmSettingType {
  GEOFENCE = 'geofence',
  GEOFENCE_IN_OR_OUT = 'geofence_in_or_out',
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
}
