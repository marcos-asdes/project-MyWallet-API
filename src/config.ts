import { MongoClient, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let database = null;
let mongoClient: MongoClientOptions;

if (process.env.MONGO_URL) {
  mongoClient = new MongoClient(process.env.MONGO_URL);
} else {
  mongoClient = new MongoClient('localhost');
}

try {
  await mongoClient.connect();
  database = mongoClient.db(process.env.DATABASE);
  console.log('MongoDB database connected');
} catch (error) {
  console.log('Error connecting to database', error);
}

export default database;
