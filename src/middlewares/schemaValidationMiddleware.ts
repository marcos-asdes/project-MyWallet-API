import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import logHandler from '../events/logHandler.js';
import { ErrorLog } from '../events/errorHandler.js';

function schemaValidationMiddleware(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body;
    const { error } = schema.validate(body, { abortEarly: false });
    if (error)
      throw new ErrorLog(422, error.details.map(e => e.message).join(', '));
    res.locals.body = body;
    logHandler('Middleware', 'Schema validated');
    next();
  };
}

export default schemaValidationMiddleware;
