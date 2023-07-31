import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not supplied.');
  }
  try {
    console.log('connecting to mongodb...');
    await mongoose.connect(process.env.LOCATION_DATABASE_MONGODB_URI as string);
    console.log('connected to mongodb :)');
  } catch (error) {
    console.log('There is an error in connecting to mongoDb');
    console.error(error);
  }

  app.listen(4000, () => {
    console.log('listening on port 4000');
  });
};

start();
