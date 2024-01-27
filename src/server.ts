import { app } from "./app";
import mongoose from "mongoose";
import "dotenv/config";
import {
  BadRequestError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";
import { SnsService } from "./services/sns";
import {
  awsConfig,
  awsConfigUtils,
  snsTopicArns,
  sqsQueueArns,
} from "../config/aws-config";
import "dotenv/config";
import { SqsService } from "./services/sqs";

const PORT = process.env.PORT!;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING!;
const LOCATION_CREATED_TOPIC = process.env.LOCATION_CREATED_TOPIC!;
const LOCATION_CREATED_QUEUE = process.env.LOCATION_CREATED_QUEUE!;

const server = async () => {
  if (process.env.NODE_ENV === "dev") {
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

    // Listing SNS topics
    const snsTopics = await SnsService.listAllSnsTopics(awsConfig);
    const topicArnList = snsTopics.Topics;

    if (!topicArnList) {
      throw new NotFoundError("No topic lists found");
    }

    topicArnList.forEach(async (topicArn) => {
      if (!topicArn.TopicArn) {
        throw new NotFoundError("No topics found");
      }
      const topicNameList = topicArn.TopicArn?.split(":");
      const topicName = topicNameList[topicNameList.length - 1];
      await awsConfigUtils.saveSnsTopicArns(topicName, topicArn.TopicArn);
    });

    console.log("These are all the topic arns: ", snsTopicArns);

    // Listing SQS queues
    const sqsQueues = await SqsService.listAllSqsQueues(awsConfig);
    const sqsQueueUrlList = sqsQueues.QueueUrls;

    if (!sqsQueueUrlList) {
      throw new NotFoundError("No queue Urls found");
    }

    sqsQueueUrlList.forEach(async (queueUrl) => {
      const queueUrlNameBit = queueUrl.split("/");
      const queueName = queueUrlNameBit[queueUrlNameBit.length - 1];

      const queueUrls = await awsConfigUtils.saveSqsQueueUrls(
        `${queueName}:url`,
        queueUrl
      );

      const sqsQueueArn = await SqsService.getQueueAttributes(awsConfig, {
        queueUrl,
        attributeNames: ["QueueArn"],
      });

      if (!sqsQueueArn || !sqsQueueArn.Attributes?.QueueArn) {
        throw new NotFoundError("No queues created");
      }
      await awsConfigUtils.saveSqsQueueArns(
        queueName,
        sqsQueueArn.Attributes.QueueArn
      );
    });

    console.log("These are all the queues:", sqsQueueArns);

    app.listen(parseInt(PORT), () => {
      console.log(
        `V1 location-service running on port ${PORT} running in dev mode`
      );
    });
  }
};

server();
