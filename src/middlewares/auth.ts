import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types/session-request-middleware-type';
import LoginError from '../services/errors/login-error';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new LoginError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization!);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new LoginError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
