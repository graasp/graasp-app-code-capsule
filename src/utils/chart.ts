import { setMilliseconds, setMinutes, setSeconds } from 'date-fns';

export const INTERVAL_DURATION_IN_MINUTES = 10;
export const VERSION_STEP_DURATION = 2000;

// Function to convert seconds to hours and minutes
export const formatSeconds = (
  seconds: number,
): { hours: number; minutes: number } => {
  // Calculate total hours and remaining minutes
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return { hours, minutes };
};

export const roundDateToIntervalStart = (date: string): string => {
  // Set seconds and milliseconds to 0 to clear them out
  let result = setSeconds(date, 0);
  result = setMilliseconds(result, 0);

  // Get the minutes and calculate the nearest lower ten
  const minutes = result.getMinutes();
  const roundedMinutes = minutes - (minutes % INTERVAL_DURATION_IN_MINUTES);

  // Set the minutes to the rounded down value
  result = setMinutes(result, roundedMinutes);

  return result.toISOString();
};
