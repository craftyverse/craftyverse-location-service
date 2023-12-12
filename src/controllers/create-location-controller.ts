import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";

import { locationSchema } from "../schemas/location-schema";
import { logEvents } from "../middleware/log-events";
import {
  ConflictError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";

const createLocationHandler = asyncHandler(
  async (req: Request, res: Response) => {
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

    const location = createLocationRequest.data;

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
    const newLocation = await LocationService.createLocation(location);

    // Save to redis cache

    // Emit an event that a new location has been created

    res.status(201).send(newLocation.toJSON());
  }
);

export { createLocationHandler };
