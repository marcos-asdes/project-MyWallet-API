import { Request, Response, NextFunction } from 'express';
import { signUpSchema, signInSchema } from '../schemas/authSchema.js';

export function validateSignIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = signInSchema.validate(req.body);
  if (error) {
    return res.sendStatus(422); // unprocessable entity
  }
  next();
}

export function validadeSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return res.sendStatus(422); // unprocessable entity
  }
  next();
}
