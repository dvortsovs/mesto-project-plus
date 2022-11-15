import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types/session-request-middleware-type';
import LoginError from '../services/errors/login-error';

const extractBearerToken = (header: string) => header.replace('jwt=', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new LoginError('Необходима авторизация'));
    return;
  }

  const token = extractBearerToken(cookie);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new LoginError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
