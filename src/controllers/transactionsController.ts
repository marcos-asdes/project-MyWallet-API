import { Request, Response } from 'express';

async function getTransactionsController(_req: Request, res: Response): Promise<Response> {
  // tem q ter um middleware de autenticação
  // pega as transações no banco de dados baseados no id do usuário
  return res.sendStatus(200);
  //return res.send(transactions);
}

async function addTransactionsController(req: Request, res: Response): Promise<Response> {
  // executar a validação de schema no middleware, erro 422
  // adicionar transação no bd (verificar regras de saldo?)
  return res.sendStatus(201);
}

export { getTransactionsController, addTransactionsController };
