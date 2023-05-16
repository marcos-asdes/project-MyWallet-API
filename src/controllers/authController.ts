import { Request, Response } from 'express';
import { Document, ObjectId, WithId } from 'mongodb';
import logHandler from '../events/logHandler.js';
import { authRepository } from '../repositories/authRepository.js';
import * as service from '../services/authService.js';

async function signUpController(req: Request, res: Response): Promise<Response> {
  const { name, email, password } = res.locals.body;
  const route: string = req.url;
  await service.checkIfUserIsRegistered(email, route);
  const encryptedPassword: string = await service.encryptPassword(password);
  await authRepository.registerUserInDatabase(name, email, encryptedPassword);
  const data: string = `User ${email} has been registered successfully.`;
  logHandler('Controller', 'User signed up');
  return res.status(201).send(data);
}

async function signInController(req: Request, res: Response): Promise<Response> {
  const { email, password } = res.locals.body;
  const route: string = req.url;
  const user: WithId<Document> = await service.checkIfUserIsRegistered(email, route);
  const encryptedPassword: string = user.password;
  const userId: ObjectId = user._id;
  await service.checkIfPasswordIsValid(password, encryptedPassword);
  const token: string = await service.generateToken(userId);
  await service.registerANewActiveSession(userId, token);
  const data: string = `User ${email} has successfully logged in. \n\n User token: ${token}`;
  logHandler('Controller', 'User signed in');
  return res.status(200).send(data);
}

async function signOutController(req: Request, res: Response): Promise<Response> {
  //const { authorization } = req.headers;
  //const token = authorization?.replace('Bearer', '').trim();

  // verifica se o token existe
  // verifica se o token é válido
  // remove o token do banco de dados
  return res.sendStatus(200);
}

export { signInController, signUpController, signOutController };
