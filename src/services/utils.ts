import { SessionRequest } from '../types/session-request-middleware-type';

export const getCurrentUserId = (req: SessionRequest) => {
  if (typeof req.user !== 'string') {
    return req.user?._id;
  }
  return undefined;
};
