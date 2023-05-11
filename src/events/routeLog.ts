import { NextFunction, Request, Response } from 'express';
import logHandler from './logHandler.js';

export async function routeLog(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  logHandler('Route', `Route ${req.url} accessed with method ${req.method}`);
  next();
}
