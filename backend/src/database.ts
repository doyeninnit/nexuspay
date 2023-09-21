// import { MongoClient } from 'mongodb';

// const MONGO_URL = "mongodb+srv://agatenashons:nashtech9021@afpay.cnz3ecn.mongodb.net/?retryWrites=true&w=majority"
// const DB_NAME = 'afpay';

// let db: any;

// export async function connect() {
//     const client = new MongoClient(MONGO_URL);
    
    
//       await client.connect();
//   db = client.db(DB_NAME);
// }

// export function getDatabase() {
//   return db;
// }

import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://agatenashons:nashtech9021@afpay.cnz3ecn.mongodb.net/?retryWrites=true&w=majority";

export async function connect() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Successfully connected to MongoDB using Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
