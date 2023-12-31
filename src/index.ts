import mongoose from "mongoose";
import { app } from "./app";
import redisClient from "./services/redis-service";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not supplied.");
  }

  if (!process.env.LOCATION_DATABASE_MONGODB_URI) {
    throw new Error("LOCATION_DATABASE_MONGODB_URI is not supplied");
  }

  if (!process.env.REDIS_PASSWORD) {
    console.log(process.env.REDIS_PASSWORD);
  }

  if (!process.env.LOCALSTACK_HOST_URL) {
    throw new Error("LOCALSTACK_HOST_URL is not supplied!");
  }

  redisClient.ping();

  try {
    console.log("connecting to mongodb...");
    await mongoose.connect(process.env.LOCATION_DATABASE_MONGODB_URI as string);
    console.log("connected to mongodb :)");
  } catch (error) {
    console.log("There is an error in connecting to mongoDb");
    console.error(error);
  }

  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
};

start();
