import {
  CreateQueueCommand,
  CreateQueueCommandInput,
  CreateQueueCommandOutput,
  GetQueueAttributesCommandOutput,
  SQSClient,
  SQSClientConfig,
} from "@aws-sdk/client-sqs";

export const awsSqsClientTest = (() => {
  let sqsClient: SQSClient;

  const createSqsClient = (config: SQSClientConfig): SQSClient => {
    if (!sqsClient) {
      sqsClient = new SQSClient(config);
    }

    return sqsClient;
  };

  const createSqsQueue = async (
    config: SQSClientConfig,
    queueName: string,
    attributes: {
      delaySeconds: string;
      messageRetentionPeriod: string; // 7 days
      receiveMessageWaitTimeSeconds: string;
    }
  ): Promise<CreateQueueCommandOutput | string> => {
    const sqsClient = createSqsClient(config);

    const createSqsQueueParams: CreateQueueCommandInput = {
      QueueName: queueName,
      Attributes: {
        DelaySeconds: attributes.delaySeconds,
        MessageRetentionPeriod: attributes.messageRetentionPeriod,
        ReceiveMessageWaitTimeSeconds: attributes.receiveMessageWaitTimeSeconds,
      },
    };

    console.log(createSqsQueueParams);

    const createSqsQueueCommand = new CreateQueueCommand(createSqsQueueParams);

    const createSqsQueueResponse: GetQueueAttributesCommandOutput =
      await sqsClient.send(createSqsQueueCommand);

    console.log(createSqsQueueResponse);

    return createSqsQueueResponse;
  };

  return {
    createSqsClient,
    createSqsQueue,
  };
})();
