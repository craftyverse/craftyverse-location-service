import { SNSClientConfig } from "@aws-sdk/client-sns";
import "dotenv/config";

export const snsTopicArns: { [key: string]: string } = {};
export const sqsQueueArns: { [key: string]: string } = {};
export const sqsQueueUrls: { [key: string]: string } = {};

export const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.LOCALSTACK_HOST_URL!,
};

export const awsConfigUtils = (() => {
  const saveSnsTopicArns = async (
    topic: string,
    topicArn: string
  ): Promise<Record<string, string>> => {
    snsTopicArns[topic] = topicArn;
    return snsTopicArns;
  };

  const saveSqsQueueArns = async (
    queue: string,
    queueArn: string
  ): Promise<Record<string, string>> => {
    sqsQueueArns[queue] = queueArn;
    return sqsQueueArns;
  };

  const saveSqsQueueUrls = async (
    queue: string,
    queueUrl: string
  ): Promise<Record<string, string>> => {
    sqsQueueUrls[queue] = queueUrl;
    return sqsQueueUrls;
  };

  const getTopicArns = async (): Promise<Record<string, string>> => {
    return snsTopicArns;
  };

  const getQueueArns = async (): Promise<Record<string, string>> => {
    return sqsQueueArns;
  };

  const getQueueUrls = async (): Promise<Record<string, string>> => {
    return sqsQueueUrls;
  };

  return {
    saveSnsTopicArns,
    saveSqsQueueArns,
    saveSqsQueueUrls,
    getQueueArns,
    getTopicArns,
    getQueueUrls,
  };
})();
