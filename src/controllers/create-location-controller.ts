import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";

import {
  locationSchema,
  LocationRequest,
  LocationResponse,
} from "../schemas/location-schema";
import { logEvents } from "../middleware/log-events";
import {
  ConflictError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";
import {
  awsConfig,
  awsConfigUtils,
  sqsQueueArns,
  sqsQueueUrls,
} from "../../config/aws-config";
import { SnsService } from "../services/sns";
import { RedisService } from "../services/redis";
import { SqsService } from "../services/sqs";

const createLocationHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // retrieving user information
    const authenticatedUserEmail = req.userEmail;

    // Checking that the request is vaid
    const createLocationRequest = locationSchema.safeParse(req.body);

    if (!createLocationRequest.success) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          createLocationRequest.error.issues
        )}`,
        "errors.txt"
      );

      throw new RequestValidationError(createLocationRequest.error.issues);
    }

    const location: LocationRequest = createLocationRequest.data;

    // Check if the location exists in the database
    const existingLocation = await LocationService.getLocationByEmail(
      location.locationEmail
    );

    if (existingLocation) {
      const methodName = "createLocationHandler";
      const message = "Location already exists.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "errors.txt"
      );
      throw new ConflictError(message);
    }

    // create new location
    const newLocation = await LocationService.createLocation({
      ...location,
      locationUserEmail: authenticatedUserEmail,
    });

    const createdLocationResponse = newLocation.toJSON();

    const createdLocationResponseString = JSON.stringify(
      createdLocationResponse
    );

    console.log(createdLocationResponseString);

    const snsTopicArns = await awsConfigUtils.getTopicArns();

    // Emit an event that a new location has been created
    const message = await SnsService.publishSnsMessage(awsConfig, {
      message: createdLocationResponseString,
      subject: snsTopicArns[process.env.LOCATION_CREATED_TOPIC!],
      topicArn: process.env.LOCATION_CREATED_TOPIC_ARN!,
    });

    // Save to redis cache
    const existingChachedLocation = await RedisService.get(
      `location:${newLocation.id}`
    );

    if (!existingChachedLocation) {
      const cachedLocation = await RedisService.set(
        `location:${newLocation.id}`,
        createdLocationResponseString
      );

      console.log(cachedLocation);
    }

    res.status(201).send(newLocation.toJSON());
  }
);

export { createLocationHandler };
