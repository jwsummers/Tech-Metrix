import { DateTime } from 'luxon';

export const getStartOfWeek = () => {
  const now = DateTime.local();
  return now.startOf('week');
};

// Removed `.toISODate()` call here to prevent build-time issues
// This now returns a Luxon DateTime object
export const getStartOfWeekDate = () => {
  return getStartOfWeek(); // no .toISODate()
};

// Returns YYYY-MM-DD string from ISO date
export const formatDateShort = (dateStr: string) => {
  return DateTime.fromISO(dateStr).toFormat('yyyy-MM-dd');
};
