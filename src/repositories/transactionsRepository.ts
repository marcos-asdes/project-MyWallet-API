import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import db from '../config.js';
import { ErrorLog } from '../events/errorHandler.js';
import logHandler from '../events/logHandler.js';
import { Transaction, TransactionWithoutId } from '../types/types.js';

async function getAllTransactionsFromDatabase(userId: ObjectId): Promise<Transaction[]> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const transactions = await db
    .collection<Transaction>('transactions')
    .find({ userId: userId })
    .toArray();
  logHandler('Repository', 'Repository accessed successfully');
  return transactions;
}

async function addTransactionInDatabase(
  type: string,
  value: number,
  description: string,
  userId: ObjectId
): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection<TransactionWithoutId>('transactions').insertOne({
    type: type,
    value: value,
    description: description,
    date: dayjs().format('DD/MM'),
    userId: userId
  });
  logHandler('Repository', 'Repository accessed successfully');
}

export const transactionsRepository = {
  getAllTransactionsFromDatabase,
  addTransactionInDatabase
};
