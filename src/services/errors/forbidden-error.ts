import { CustomError } from '../../types/custom-error-type';

export default class ForbiddenError extends Error implements CustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
