
import mongoose from 'mongoose';
import session from "express-session";
import MongoStore from "connect-mongo";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});
