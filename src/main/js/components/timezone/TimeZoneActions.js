export const UPDATE_TIME_ZONE = 'UPDATE_TIME_ZONE';

export function updateTimeZone(timeZone) {
  return { type: UPDATE_TIME_ZONE, timeZone };
};
