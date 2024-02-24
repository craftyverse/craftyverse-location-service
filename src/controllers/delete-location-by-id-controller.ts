import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { logEvents } from "../middleware/log-events";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";

const deleteLocationByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const locationId = req.params.id;

  if (!locationId) {
    const message = "Location ID is required.";
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\t${message}`, "errors.txt");

    throw new BadRequestError(message);
  }

  const deletedLocationRequest = await LocationService.deleteLocationById(locationId);

  if (!deletedLocationRequest) {
    throw new BadRequestError("Location did not delete successfully.");
  }
  res.send(deletedLocationRequest);
});

export { deleteLocationByIdHandler };
