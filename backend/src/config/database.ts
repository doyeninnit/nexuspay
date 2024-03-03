
import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://productionbranch:productionbranch9021@cluster0.y6bk3ba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export async function connect() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Successfully connected to MongoDB using Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
