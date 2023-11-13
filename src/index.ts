import mongoose from "mongoose";
import { app } from "./app";
import {
  awsSqsClient,
  awsSnsClient,
  redisClient,
  locationQueueVariables,
  locationEventVariables,
} from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "./config/aws-config";

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

  if (
    process.env.NODE_ENV === "local" ||
    process.env.NODE_ENV === "local_test"
  ) {
    // Create SNS location created Topic and SQS location created Queue
    const topicArn = await awsSnsClient.createSnsTopic(
      awsConfig,
      locationEventVariables.LOCATION_CREATED_EVENT
    );
    console.log("This is the create location topic ARN: ", topicArn);

    const sqsQueueAttributes = {
      delaySeconds: "0",
      messageRetentionPeriod: "604800", // 7 days
      receiveMessageWaitTimeSeconds: "0",
    };

    const createLocationQueue = await awsSqsClient.createSqsQueue(
      awsConfig,
      locationQueueVariables.LOCATION_CREATED_QUEUE,
      sqsQueueAttributes
    );

    console.log("This is the new location queue: ", createLocationQueue);
  }

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
