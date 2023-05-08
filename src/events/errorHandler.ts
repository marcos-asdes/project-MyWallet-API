import { Request, Response, NextFunction } from 'express';
import appLog from './logHandler.js';

class errorLog {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const { statusCode, message } = error;

  appLog('Error', message);
  return error.statusCode !== 500
    ? res.status(statusCode).send({ message })
    : res.status(500).send({ message: error });
}

export { errorLog };
export default errorHandler;
