import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types/session-request-middleware-type';
import LoginError from '../services/errors/login-error';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new LoginError('Необходима авторизация'));
    return;
  }
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
