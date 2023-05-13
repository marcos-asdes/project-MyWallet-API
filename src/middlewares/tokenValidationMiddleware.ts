import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document, WithId } from 'mongodb';
import logHandler from '../events/logHandler.js';
import { ErrorLog } from '../events/errorHandler.js';
import { authRepository } from '../repositories/authRepository.js';

async function tokenValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader: string | undefined = req.header('Authorization');

  if (!authHeader) {
    throw new ErrorLog(401, 'Missing authorization header');
  }

  const token: string = authHeader.replace('Bearer ', '');
  if (!token) {
    throw new ErrorLog(401, 'Missing token');
  }

  if (process.env.JWT_SECRET) {
    try {
      const { sub } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      if (!sub) {
        throw new ErrorLog(401, 'Invalid token');
      }
      const user_data: WithId<Document> | null =
        await authRepository.findUserIdInDatabase(sub);
      if (!user_data) {
        throw new ErrorLog(404, 'User not found');
      }
      res.locals.user_data = user_data;
      res.locals.subject = sub;
    } catch (error) {
      throw new ErrorLog(500, String(error));
    }
  } else {
    throw new ErrorLog(500, 'JWT environment variable not found');
  }

  logHandler('Middleware', 'Validated token');
  next();
}

export default tokenValidationMiddleware;