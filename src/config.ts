import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { ErrorLog } from './events/errorHandler.js';
import logHandler from './events/logHandler.js';

dotenv.config({ path: '.env' });

let db: Db | null = null;
let mongoClient: MongoClient;

export const connectToMongoDB = async (): Promise<void> => {
  if (!process.env.MONGO_URL || !process.env.DATABASE)
    throw new ErrorLog(500, 'Environment variables not specified');
  mongoClient = new MongoClient(process.env.MONGO_URL);
  return mongoClient
    .connect()
    .then(() => {
      db = mongoClient.db(process.env.DATABASE);
      logHandler('Server', 'MongoDB database connected');
    })
    .catch(error => {
      logHandler('Error', String(error));
    });
};

export default db;
