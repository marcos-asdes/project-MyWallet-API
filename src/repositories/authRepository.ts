import { ObjectId } from 'mongodb';
import db from '../config.js';
import { ErrorLog } from '../events/errorHandler.js';
import logHandler from '../events/logHandler.js';
import { User, UserId, UserWithoutId } from '../types/types.js';

async function registerUserInDatabase(
  name: string,
  email: string,
  password: string
): Promise<void> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  await db.collection<UserWithoutId>('users').insertOne({
    name: name,
    email: email,
    password: password
  });
  logHandler('Repository', 'Repository accessed successfully');
}

async function findUserInDatabase_ThroughEmail(email: string): Promise<User | null> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const user: User | null = await db.collection<User>('users').findOne({
    email: email
  });
  logHandler('Repository', 'Repository accessed successfully');
  return user;
}

async function findUserInDatabase_ThroughUserId(userId: ObjectId): Promise<User | null> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const user: User | null = await db.collection<User>('users').findOne({
    _id: userId
  });
  logHandler('Repository', 'Repository accessed successfully');
  return user;
}

async function findUserIdInDatabase(id: ObjectId): Promise<UserId | null> {
  if (!db) throw new ErrorLog(500, 'Database connection not established');
  const userId: UserId | null = await db
    .collection<User>('users')
    .findOne({ _id: id, projection: { _id: 1 } });
  logHandler('Repository', 'Repository accessed successfully');
  return userId;
}

export const authRepository = {
  registerUserInDatabase,
  findUserInDatabase_ThroughEmail,
  findUserInDatabase_ThroughUserId,
  findUserIdInDatabase
};
