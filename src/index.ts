import mongoose from "mongoose";
import { app } from "./app";
import redisClient from "./services/redis-service";
import { createLocationCreatedTopic } from "./events/create-event-definitions";
import { awsSqsClient } from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "./config/aws-config";
import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { locationQueueVariables } from "./events/variables";

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

  if (!process.env.AWS_LOCALSTACK_URI) {
    throw new Error("AWS_LOCALSTACK_URI is not supplied!");
  }

  redisClient.ping();

  // Create SNS location created Topic and SQS location created Queue
  const topicArn = await createLocationCreatedTopic();
  console.log("This is the topic ARN: ", topicArn);

  const sqsQueueAttributes = {
    delaySeconds: "0",
    messageRetentionPeriod: "604800", // 7 days
    receiveMessageWaitTimeSeconds: "0",
  };

  const createLocationQueue = await awsSqsClient.createSqsQueue(
    awsConfig as SQSClientConfig,
    locationQueueVariables.LOCATION_CREATED_QUEUE,
    sqsQueueAttributes
  );

  console.log("This is the new queue: ", createLocationQueue);

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
