import { Document, WithId } from 'mongodb';
import db from '../config.js';
import { ErrorLog } from '../events/errorHandler.js';
import logHandler from '../events/logHandler.js';

async function registerUserInDatabase(
  name: string,
  email: string,
  password: string
): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection('users').insertOne({
    name: name,
    email: email,
    password: password
  });
  logHandler('Repository', 'Repository accessed successfully');
}

async function findUserInDatabase(
  email: string
): Promise<WithId<Document> | null> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const user: WithId<Document> | null = await db.collection('users').findOne({
    email: email
  });
  logHandler('Repository', 'Repository accessed successfully');
  return user;
}

async function registerUserSessionInDatabase(
  userId: string,
  token: string
): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection('sessions').insertOne({
    token: token,
    userId: userId
  });
  logHandler('Repository', 'Repository accessed successfully');
}

async function deleteUserSessionInDatabase(token: string): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection('sessions').deleteOne({ token });
  logHandler('Repository', 'Repository accessed successfully');
}

export {
  registerUserInDatabase,
  findUserInDatabase,
  registerUserSessionInDatabase,
  deleteUserSessionInDatabase
};