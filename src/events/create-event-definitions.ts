import {
  awsSnsClient,
  locationEventVariables,
} from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "../config/aws-config";

export const createLocationCreatedTopic = async (): Promise<string> => {
  const locationCreatedTopic = locationEventVariables.LOCATION_CREATED_EVENT;
  const createdTopic = await awsSnsClient.createSnsTopic(
    awsConfig,
    locationCreatedTopic
  );

  return createdTopic.topicArn;
};
