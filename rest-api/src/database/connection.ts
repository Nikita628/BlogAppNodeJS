import mongoose from "mongoose";
import { config } from "../config";

export async function connectDb() {
  try {
    await mongoose.connect(config.connectionString);
    console.log('connected DB');
  } catch (error) {
    console.log('connection to DB failed: ', error);
    throw error;
  }
}
