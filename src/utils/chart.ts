import { AppAction } from '@graasp/sdk';

import {
  addMinutes,
  addSeconds,
  format,
  formatDuration,
  getMinutes,
  intervalToDuration,
  isBefore,
  isEqual,
  parseISO,
  setMinutes,
} from 'date-fns';

import { CodeVersionType } from '@/interfaces/codeVersions';

const INTERVAL_DURATION_IN_MINUTES = 10;
export const VERSION_STEP_DURATION = 2000;

// Function that take starttime and end time and handle intervals between depends on INTERVAL_DURATION_IN_MINUTES
export const distributeIntervals = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): { [key: string]: number } => {
  const start = parseISO(startDate);
  const end = addMinutes(endDate, INTERVAL_DURATION_IN_MINUTES);
  let current = setMinutes(
    start,
    Math.floor(getMinutes(start) / INTERVAL_DURATION_IN_MINUTES) *
      INTERVAL_DURATION_IN_MINUTES,
  );
  const group: { [key: string]: number } = {};
  while (end > current) {
    group[format(current, "yyyy-MM-dd'T'HH:mm:ssXXX")] = 0;
    current = addMinutes(current, INTERVAL_DURATION_IN_MINUTES);
  }
  return group;
};

export const groupActionsPerInterval = (
  intervals: { [key: string]: number },
  actions: AppAction<CodeVersionType>[],
): { [key: string]: number } => {
  const intervalsCopy = { ...intervals };
  const intervalArr = Object.keys(intervals);
  intervalArr.forEach((interval, index) => {
    const totalActionsPerInterval = actions.reduce((acc, action) => {
      const nextInterval = intervalArr[index + 1];
      if (
        (isBefore(action.createdAt, nextInterval) ||
          isEqual(action.createdAt, nextInterval)) &&
        isBefore(action.createdAt, interval) === false
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    intervalsCopy[interval] = totalActionsPerInterval;
  });
  return intervalsCopy;
};

// Function to convert seconds to formatted duration
export const formatSeconds = (seconds: number): string => {
  const baseDate = new Date(0);
  const endDate = addSeconds(baseDate, seconds);
  // Calculate the duration between the base date and the end date
  const duration = intervalToDuration({ start: baseDate, end: endDate });
  // Format duration to hours and minutes
  return formatDuration(duration, {
    format: ['hours', 'minutes'],
  });
};

export const getTimeSpentInSeconds = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}): number => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  // Calculate the duration between the two times
  const duration = intervalToDuration({ start, end });

  const durationInSeconds =
    (duration?.hours || 0) * 3600 +
    (duration?.minutes || 0) * 60 +
    (duration?.seconds || 0);

  return durationInSeconds;
};
