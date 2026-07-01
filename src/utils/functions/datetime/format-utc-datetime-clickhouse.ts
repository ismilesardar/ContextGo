import { TZDate } from '@date-fns/tz';

export const formatUTCDateTimeClickHouse = (date: Date | TZDate) => {
  return new Date(date.getTime())
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');
};
