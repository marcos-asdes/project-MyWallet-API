import { Document, WithId } from 'mongodb';
import db from '../config.js';
import { ErrorLog } from '../events/errorHandler.js';
import logHandler from '../events/logHandler.js';
import dayjs from 'dayjs';

async function getTransactionsFromDatabase(userId: string): Promise<WithId<Document>[]> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const transactions = await db.collection('transactions').find({ userId: userId }).toArray();
  logHandler('Repository', 'Repository accessed successfully');
  return transactions;
}

async function addTransactionInDatabase(
  type: string,
  value: number,
  description: string,
  userId: string
): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection('transactions').insertOne({
    type,
    value,
    description,
    date: dayjs().format('DD/MM'),
    userId: userId
  });
  logHandler('Repository', 'Repository accessed successfully');
}
export { getTransactionsFromDatabase, addTransactionInDatabase };
