import { SNSClientConfig } from "@aws-sdk/client-sns";
import "dotenv/config";

export const snsTopicArns: { [key: string]: string } = {};
export const sqsQueueArns: { [key: string]: string } = {};

export const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.LOCALSTACK_HOST_URL!,
};

export const awsConfigUtils = (() => {
  const saveSnsTopicArns = (topic: string, topicArn: string) => {
    snsTopicArns[topic] = topicArn;
  };

  const saveSqsQueueArns = (queue: string, queueArn: string) => {
    sqsQueueArns[queue] = queueArn;
  };

  return {
    saveSnsTopicArns,
    saveSqsQueueArns,
  };
})();
