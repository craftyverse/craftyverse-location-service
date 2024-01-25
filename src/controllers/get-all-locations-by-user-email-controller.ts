import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { logEvents } from "../middleware/log-events";
import {
  BadRequestError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";

const getAllLocationsByUserEmailHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userEmail = req.params.userEmail;
    const { limit, page } = req.query;

    if (!userEmail) {
      const methodName = "getLocationByEmailHandler";
      const message = "All required fields are required";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "errors.txt"
      );
      throw new NotFoundError(message);
    }

    // Retrieve all locations
    const retrievedLocations = await LocationService.getAllLocationsByUserEmail(
      parseInt(page as string),
      parseInt(limit as string),
      userEmail
    );

    res.status(200).send(retrievedLocations);
  }
);

export { getAllLocationsByUserEmailHandler };
