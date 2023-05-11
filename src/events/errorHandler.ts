import { Request, Response, NextFunction } from 'express';
import logHandler from './logHandler.js';

class ErrorLog {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

async function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  const { statusCode, message } = error;
  logHandler('Error', message);
  return error.statusCode !== 500
    ? res.status(statusCode).send({ message })
    : res.status(500).send({ message: error });
}

export { ErrorLog };
export default errorHandler;
