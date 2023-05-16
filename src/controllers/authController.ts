import { Request, Response } from 'express';
import logHandler from '../events/logHandler.js';
import { authRepository } from '../repositories/authRepository.js';
import * as service from '../services/authService.js';

async function signUpController(
  _req: Request,
  res: Response
): Promise<Response> {
  const { name, email, password } = res.locals.body;
  await service.checkIfUserIsAlreadyRegistered(email);
  const encryptedPassword = await service.encryptPassword(password);
  await authRepository.registerUserInDatabase(name, email, encryptedPassword);
  const data = `User ${email} has been registered successfully.`;
  logHandler('Controller', 'User signed up');
  return res.status(201).send(data);
}

async function signInController(
  req: Request,
  res: Response
): Promise<Response> {
  // verifica se o usuário existe
  // verifica se o login está correto (email e senha batem)
  // verifica se o usuario já esta logado ???
  // cria token de autenticação do usuário
  // cria sessão do usuario (dá pra acrescentar mais lógicas aqui)
  return res.sendStatus(200);
  //return res.send({ token, name: user.name });
}

async function signOutController(
  req: Request,
  res: Response
): Promise<Response> {
  //const { authorization } = req.headers;
  //const token = authorization?.replace('Bearer', '').trim();

  // verifica se o token existe
  // verifica se o token é válido
  // remove o token do banco de dados
  return res.sendStatus(200);
}

export { signInController, signUpController, signOutController };
