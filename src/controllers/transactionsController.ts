import { Request, Response } from 'express';
import { transactionsRepository } from '../repositories/transactionsRepository.js';
import { Transaction } from '../types/types.js';
import logHandler from '../events/logHandler.js';

async function getTransactionsController(_req: Request, res: Response): Promise<Response> {
  const sub = res.locals.subject;
  const allUserTransactions: Transaction[] =
    await transactionsRepository.getAllTransactionsFromDatabase(sub);
  logHandler('Controller', `User transactions have been sent`);
  return res.status(200).send(allUserTransactions);
}

async function addTransactionsController(_req: Request, res: Response): Promise<Response> {
  const { type, description, value } = res.locals.body;
  const { _id, email } = res.locals.user_data;
  await transactionsRepository.addTransactionInDatabase(type, value, description, _id);
  const data: string = `The transaction has been added to the user ${email}: \ntype: ${type}\nvalue: ${value}\ndescription: ${description}`;
  logHandler('Controller', `User transaction has been added`);
  return res.status(200).send(data);
}

export { getTransactionsController, addTransactionsController };
