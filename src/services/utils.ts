import { SessionRequest } from '../types/session-request-middleware-type';

export const getCurrentUserId = (req: SessionRequest) => {
  if (typeof req.user !== 'string') {
    return req.user?._id;
  }
  return undefined;
};

export const calculatedMaxAge = (minutes: number, hours: number, days: number) => {
  let maxAge = 0;
  if (minutes) {
    maxAge = 60000 * minutes;
  }
  if (hours) {
    maxAge += 60000 * 60 * hours;
  }
  if (days) {
    maxAge += 60000 * 60 * 24 * days;
  }
  return maxAge;
};
