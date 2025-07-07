import { DateTime } from 'luxon';

/**
 * Returns start of current week (Monday 00:00) as a DateTime object.
 */
export const getStartOfWeek = (): DateTime => {
  const now = DateTime.local();
  const startOfWeek = now.startOf('week');
  return startOfWeek?.isValid ? startOfWeek : now;
};

/**
 * Returns start of current week as ISO date string.
 */
export const getStartOfWeekDate = (): string => {
  return getStartOfWeek().toISODate();
};

/**
 * Returns today's date as ISO string.
 */
export const getTodayDate = (): string => {
  return DateTime.local().toISODate();
};

/**
 * Checks if a given ISO date string falls on today's date.
 */
export const isToday = (dateString: string): boolean => {
  const today = DateTime.local().toISODate();
  const targetDate = DateTime.fromISO(dateString).toISODate();
  return today === targetDate;
};

/**
 * Formats ISO date string as short date (e.g., "Mon, Jul 8").
 */
export const formatDateShort = (dateString: string): string => {
  return DateTime.fromISO(dateString).toFormat('ccc, LLL d');
};
