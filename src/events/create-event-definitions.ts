import { awsSnsClient } from "../services/sns-service";
import { awsConfig } from "../config/aws-config";

export const createLocationCreatedTopic = async (): Promise<string> => {
  const locationCreatedTopic = "location-created";
  const createdTopic = await awsSnsClient.createSnsTopic(
    awsConfig,
    locationCreatedTopic
  );
  return createdTopic.topicArn;
};
