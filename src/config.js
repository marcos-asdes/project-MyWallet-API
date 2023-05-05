import { MongoClient } from 'mongodb'; // database
import dotenv from 'dotenv'; // environment variables

dotenv.config();

let database = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);

// initialize MongoDB on Terminal with ~ sudo systemctl start mongod

try {
    await mongoClient.connect();
    database = mongoClient.db(process.env.DATABASE);
    console.log("MongoDB database connected");
} catch (error) {
    console.log("Error connecting to database", error);
}

export default database;