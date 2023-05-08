import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { errorLog } from './events/errorHandler.js';

dotenv.config();

let database = null;
let mongoClient: MongoClient;

if (process.env.MONGO_URL && process.env.DATABASE) {
  mongoClient = new MongoClient(process.env.MONGO_URL);
  try {
    await mongoClient.connect();
    database = mongoClient.db(process.env.DATABASE);
    console.log('MongoDB database connected');
  } catch (error) {
    console.log('Error connecting to database', error);
  }
} else {
  throw new errorLog(500, 'Environment variables not specified');
}

export default database;
