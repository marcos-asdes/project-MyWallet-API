import { Request, Response } from 'express';
import { transactionsRepository } from '../repositories/transactionsRepository.js';
import { Transaction } from '../types/types.js';
import logHandler from '../events/logHandler.js';

async function getTransactionsController(_req: Request, res: Response): Promise<Response> {
  const sub = res.locals.subject;
  const allUserTransactions: Transaction[] =
    await transactionsRepository.getAllTransactionsFromDatabase(sub);
  logHandler('Controller', `The user's transactions have been sent`);
  return res.status(200).send(allUserTransactions);
}

async function addTransactionsController(req: Request, res: Response): Promise<Response> {
  // executar a validação de schema no middleware, erro 422
  // adicionar transação no bd (verificar regras de saldo?)
  return res.sendStatus(201);
}

export { getTransactionsController, addTransactionsController };
