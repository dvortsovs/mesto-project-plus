import { NextFunction, Response } from 'express';
import { SessionRequest } from '../types/session-request-middleware-type';
import { CustomError } from '../types/custom-error-type';

export default (err: CustomError, req: SessionRequest, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message:
        statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
    });
};
