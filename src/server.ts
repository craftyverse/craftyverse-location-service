import { app } from "./app";
import mongoose from "mongoose";
import "dotenv/config";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";
import { SnsService } from "./services/sns";
import { awsConfig, awsConfigUtils } from "../config/aws-config";
import "dotenv/config";
import { SqsService } from "./services/sqs";

const PORT = process.env.PORT!;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING!;
const LOCATION_CREATED_TOPIC = process.env.LOCATION_CREATED_TOPIC!;
const LOCATION_CREATED_QUEUE = process.env.LOCATION_CREATED_QUEUE!;

const server = async () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
    if (!MONGODB_CONNECTION_STRING) {
      throw new BadRequestError("MONGODB_CONNECTION_STRING not defined");
    }

    try {
      console.log("connecting to mongodb...");
      await mongoose.connect(MONGODB_CONNECTION_STRING as string);
      console.log("connected to mongodb :)");
    } catch (error) {
      console.log("There is an error in connecting to mongoDb");
      console.error(error);
    }

    // create SQS queues

    const locationCreatedQueueName = await SqsService.createSqsQueue(
      awsConfig,
      LOCATION_CREATED_QUEUE!,
      {
        delaySeconds: "0",
        messageRetentionPeriod: "604800", // 7 days
        receiveMessageWaitTimeSeconds: "0",
      }
    );

    const savedQueues = await awsConfigUtils.saveSqsQueueArns(
      LOCATION_CREATED_QUEUE!,
      locationCreatedQueueName!
    );

    console.log("These are the saved queues", savedQueues);

    app.listen(parseInt(PORT), () => {
      console.log(
        `V1 location-service running on port ${PORT} running in dev mode`
      );
    });
  }
};

server();
