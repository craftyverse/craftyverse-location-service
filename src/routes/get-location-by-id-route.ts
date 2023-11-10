import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import {
  NotFoundError,
  currentUser,
  requireAuth,
} from "@craftyverse-au/craftyverse-common";
import redisClient from "../services/redis-service";
import { LocationResponse } from "../schemas/location-schema";

const router = express.Router();

router.get(
  "/api/location/getLocation/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const locationIdParam = req.params.id;
    const requestFieldsString = req.query.fields?.toString();
    const cachedLocation = await redisClient.get(locationIdParam);

    if (cachedLocation) {
      const locationPayload: LocationResponse = JSON.parse(cachedLocation);
      res.status(200).send(locationPayload);
      return;
    }

    const existingLocation = await Location.findById(locationIdParam);

    if (!existingLocation) {
      throw new NotFoundError(
        "The location that you have requested does not exist"
      );
    }

    const locationResponsePayload: LocationResponse = {
      locationId: existingLocation.id,
      locationUserId: existingLocation.locationUserId,
      locationName: existingLocation.locationName,
      locationEmail: existingLocation.locationEmail,
      locationIndustry: existingLocation.locationIndustry,
      locationCurrency: existingLocation.locationCurrency,
      locationTimeZone: existingLocation.locationTimeZone,
      locationSIUnit: existingLocation.locationSIUnit,
      locationLegalBusinessName: existingLocation.locationLegalBusinessName,
      locationLegalAddressLine1: existingLocation.locationLegalAddressLine1,
      locationLegalAddressLine2: existingLocation.locationLegalAddressLine2,
      locationLegalCity: existingLocation.locationLegalCity,
      locationLegalState: existingLocation.locationLegalState,
      locationLegalCountry: existingLocation.locationLegalCountry,
      locationLegalPostcode: existingLocation.locationLegalPostcode,
      locationApproved: existingLocation.locationApproved,
      locationFirstName: existingLocation.locationFirstName,
      locationLastName: existingLocation.locationLastName,
    };

    redisClient.set(locationIdParam, locationResponsePayload);

    if (!requestFieldsString) {
      res.send(existingLocation);
      return;
    }
    const requestFieldsArray = requestFieldsString.split(",");

    const filteredLocation: Record<string, any> = {};

    requestFieldsArray.map((field: string) => {
      const fieldValue = existingLocation.get(field);
      if (fieldValue !== undefined) {
        filteredLocation[field] = fieldValue;
      }
    });

    res.status(200).send(locationResponsePayload);
  }
);

export { router as getLocationByIdRouter };
