import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { updateLocationSchema } from "../schemas/location-schema";
import "dotenv/config";
import { logEvents } from "../middleware/log-events";
import {
  BadRequestError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";
import { RedisService } from "../services/redis";
import { SnsService } from "../services/sns";
import { awsConfig, awsConfigUtils } from "../../config/aws-config";

const updateLocationByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params.locationId);
    const locationId = req.params.locationId;

    if (!locationId) {
      const message = "Location ID is required.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${message}`,
        "errors.txt"
      );

      throw new BadRequestError(message);
    }
    const updateLocationRequest = updateLocationSchema.safeParse(req.body);

    if (!updateLocationRequest.success) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          updateLocationRequest.error.issues
        )}`,
        "errors.txt"
      );

      throw new RequestValidationError(updateLocationRequest.error.issues);
    }

    const updateLocationFields = updateLocationRequest.data;
    console.log("This is the location fields to update", updateLocationFields);

    const updatedLocation = await LocationService.updateLocationById(
      { _id: locationId },
      updateLocationFields
    );

    if (!updatedLocation) {
      const message = "Location did not update successfully.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${message}`,
        "errors.txt"
      );

      throw new BadRequestError(message);
    }

    const updatedLocationString = JSON.stringify(updatedLocation);

    const snsTopicArns = await awsConfigUtils.getTopicArns();

    // delete and set updated location to redis cache
    await RedisService.set(`location:${locationId}`, updatedLocationString);

    // publish meesage to SNS topic
    await SnsService.publishSnsMessage(awsConfig, {
      message: updatedLocationString,
      subject: process.env.LOCATION_UPDATED_TOPIC!,
      topicArn: snsTopicArns[process.env.LOCATION_UPDATED_TOPIC!],
    });

    console.log("This is the updated location: ", updatedLocation);

    res.status(200).send(updatedLocation);
  }
);

export { updateLocationByIdHandler };
