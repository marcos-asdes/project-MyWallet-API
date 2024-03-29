import { Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import logHandler from '../events/logHandler.js';

export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 60 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.ip;
  },
  handler: (_req: Request, res: Response): void => {
    logHandler('Middleware', 'Too many requests');
    res.status(429).send('Too many requests');
  }
});
