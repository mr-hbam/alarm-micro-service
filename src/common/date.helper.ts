import { format, utcToZonedTime } from 'date-fns-tz';
export const date = (
  date: string | number,
  timezone: string,
  dateFormat?: string,
) => {
  try {
    return format(
      utcToZonedTime(date, timezone),
      !dateFormat ? 'dd-MM-yyyy HH:mm:ss' : dateFormat,
    );
  } catch (err) {
    return '-';
  }
};
