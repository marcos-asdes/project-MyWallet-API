import { Request, Response } from 'express';

async function signUpController(
  req: Request,
  res: Response
): Promise<Response> {
  // verifica se o usuário já existe
  // criptografa a senha
  // armazena o usuario no banco de dados
  // alterar response!
  return res.sendStatus(201);
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
