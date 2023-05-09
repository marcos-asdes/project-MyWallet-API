import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { errorLog } from './events/errorHandler.js';
import logHandler from './events/logHandler.js';

dotenv.config({ path: '.env' });

let db = null;
let mongoClient: MongoClient;

if (process.env.MONGO_URL && process.env.DATABASE) {
  mongoClient = new MongoClient(process.env.MONGO_URL);
  try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);
    logHandler('Server', 'MongoDB database connected');
  } catch (error) {
    logHandler('Error', String(error));
  }
} else {
  throw new errorLog(500, 'Environment variables not specified');
}

export default db;
