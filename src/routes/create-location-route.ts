import express, { Request, Response } from "express";
import {
  LocationRequestSchema,
  NewLocationRequest,
  LocationResponse,
} from "../schemas/location-schema";
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
} from "@craftyverse-au/craftyverse-common";
import redisClient from "../services/redis-service";
import { awsSnsClient } from "../services/sns-service";
import { awsSqsClient } from "../services/sqs-service";
import { awsConfig } from "../config/aws-config";

import { Location } from "../models/Location";
import { createLocationCreatedTopic } from "../events/create-event-definitions";
import {
  CreateQueueCommandInput,
  SQSClient,
  SQSClientConfig,
} from "@aws-sdk/client-sqs";

const router = express.Router();

router.post(
  "/api/location/createLocation",
  requireAuth,
  async (req: Request, res: Response) => {
    const requestData = LocationRequestSchema.safeParse(req.body);

    if (!requestData.success) {
      throw new RequestValidationError(requestData.error.issues);
    }

    const location: NewLocationRequest = requestData.data;

    const existingLocation = await Location.findOne({
      locationEmail: location.locationEmail,
    });

    if (existingLocation) {
      throw new BadRequestError("This location already exists");
    }
    const createdLocation = Location.build({
      // This needs to change to the actual userId
      locationUserId: req.currentUser!.userId,
      locationName: location.locationName,
      locationEmail: location.locationEmail,
      locationIndustry: location.locationIndustry,
      locationRegion: location.locationRegion,
      locationCurrency: location.locationCurrency,
      locationTimeZone: location.locationTimeZone,
      locationSIUnit: location.locationSIUnit,
      locationLegalBusinessName: location.locationLegalBusinessName,
      locationLegalAddressLine1: location.locationLegalAddressLine1,
      locationLegalAddressLine2: location.locationLegalAddressLine2,
      locationLegalCity: location.locationLegalCity,
      locationLegalState: location.locationLegalState,
      locationLegalCountry: location.locationLegalCountry,
      locationLegalPostcode: location.locationLegalPostcode,
      locationApproved: location.locationApproved,
    });

    const savedLocation = await createdLocation.save();

    const createLocation: LocationResponse = {
      locationId: savedLocation.id,
      locationUserId: savedLocation.locationUserId,
      locationName: savedLocation.locationName,
      locationEmail: savedLocation.locationEmail,
      locationIndustry: savedLocation.locationIndustry,
      locationRegion: savedLocation.locationRegion,
      locationCurrency: savedLocation.locationCurrency,
      locationTimeZone: savedLocation.locationTimeZone,
      locationSIUnit: savedLocation.locationSIUnit,
      locationLegalBusinessName: savedLocation.locationLegalBusinessName,
      locationLegalAddressLine1: savedLocation.locationLegalAddressLine1,
      locationLegalAddressLine2: savedLocation.locationLegalAddressLine2,
      locationLegalCity: savedLocation.locationLegalCity,
      locationLegalState: savedLocation.locationLegalState,
      locationLegalCountry: savedLocation.locationLegalCountry,
      locationLegalPostcode: savedLocation.locationLegalPostcode,
      locationApproved: savedLocation.locationApproved,
    };

    redisClient.set(createLocation.locationId, createLocation);

    // Stringify the response payload
    const createLocationResponseString = JSON.stringify(createLocation);
    console.log(
      "This is the create location response string: ",
      createLocationResponseString
    );

    const topicArn = await createLocationCreatedTopic();
    console.log("This is the topic ARN: ", topicArn);

    const sqsQueueAttributes = {
      delaySeconds: "0",
      messageRetentionPeriod: "604800", // 7 days
      receiveMessageWaitTimeSeconds: "0",
    };

    const createLocationQueue = await awsSqsClient.createSqsQueue(
      awsConfig as SQSClient,
      "location_created_queue",
      sqsQueueAttributes
    );

    console.log("This is the new queue: ", createLocationQueue);

    const allSqsQueues = await awsSqsClient.listAllSqsQueues(
      awsConfig as SQSClient,
      {
        queueNamePrefix: "location_created_queue",
        maxResults: 10,
      }
    );

    console.log("list of queues: ", allSqsQueues);

    const publishSnsMessageParams = {
      message: createLocationResponseString,
      subject: "create-location-event",
      topicArn: topicArn,
    };

    const createdLocationMessage = await awsSnsClient.publishSnsMessage(
      awsConfig,
      publishSnsMessageParams
    );

    console.log(createdLocationMessage);

    if (createdLocationMessage?.$metadata.httpStatusCode !== 200) {
      throw new BadRequestError("Something went wrong!");
    }

    res.status(201).send({ ...(createLocation as LocationResponse) });
  }
);

export { router as createLocationRouter };
