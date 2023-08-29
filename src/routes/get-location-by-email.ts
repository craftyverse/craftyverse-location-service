import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
  NotAuthorisedError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";
import {
  LocationRequestSchema,
  LocationResponse,
} from "../schemas/location-schema";

const router = express.Router();

router.get(
  "/api/location/getLocationByEmail/:email",
  requireAuth,
  async (req: Request, res: Response) => {
    const locationEmailParam: string = req.params.email;
    const requestQueryFields: string | undefined =
      req.query?.fields?.toString();

    const existingLocation = await Location.findOne({
      locationEmail: locationEmailParam,
    });

    if (!existingLocation) {
      throw new NotFoundError("The location you have requested does not exist");
    }

    const locationResponsePayload: LocationResponse = {
      locationId: existingLocation.id,
      locationUserId: existingLocation.locationUserId,
      locationName: existingLocation.locationName,
      locationEmail: existingLocation.locationEmail,
      locationIndustry: existingLocation.locationIndustry,
      locationRegion: existingLocation.locationRegion,
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
    };

    if (!requestQueryFields) {
      res.status(200).send(existingLocation);
      return;
    }
    const requestFieldsArray = requestQueryFields.split(",");

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

export { router as getLocationByEmailRouter };
