import { Request, Response } from 'express';
import logHandler from '../events/logHandler.js';
import { authRepository } from '../repositories/authRepository.js';
import * as service from '../services/authService.js';
import { SignInType } from '../types/types.js';

async function signUpController(_req: Request, res: Response): Promise<Response> {
  const { name, email, password } = res.locals.body;
  await service.checkIfUserIsAlreadyRegistered(email);
  const encryptedPassword: string = service.encryptPassword(password);
  await authRepository.registerUserInDatabase(name, email, encryptedPassword);
  const data: string = `User ${email} has been registered successfully.`;
  logHandler('Controller', 'User signed up');
  return res.status(201).send(data);
}

async function signInController(_req: Request, res: Response): Promise<Response> {
  const { email, password } = res.locals.body;
  const user: SignInType = await service.checkIfUserIsRegistered(email);
  const { userId, encryptedPassword } = user;
  service.checkIfPasswordIsValid(password, encryptedPassword);
  const token: string = service.generateToken(userId);
  const data: string = `User ${email} has successfully logged in. \n\n User token: ${token}`;
  logHandler('Controller', 'User signed in');
  return res.status(200).send(data);
}

export { signInController, signUpController };
