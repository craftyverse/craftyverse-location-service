import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { logEvents } from "../middleware/log-events";
import { NotFoundError } from "@craftyverse-au/craftyverse-common";
import { LocationService } from "../services/location";
import { RedisService } from "../services/redis";
import { SqsService } from "../services/sqs";
import {
  LocationResponse,
  LocationCurrency,
  LocationRegion,
} from "../schemas/location-schema";

const getLocationByEmailHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const locationId = req.params.locationId;

    if (!locationId) {
      const methodName = "getLocationByIdHandler";
      const message = "Location ID is not provided.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "errors.txt"
      );
      throw new NotFoundError(message);
    }

    // Retrieve location from cache
    const cachedLocation = await RedisService.get(`location:${locationId}`);

    if (cachedLocation) {
      const location = JSON.parse(cachedLocation);
      const retrievedLocationResponse: LocationResponse = {
        locationId: location._id,
        locationLegalName: location.locationLegalName,
        locationUserEmail: location.locationUserEmail,
        locationEmail: location.locationEmail,
        locationIndustry: location.locationIndustry,
        locationRegion: location.locationRegion as LocationRegion,
        locationCurrency: location.locationCurrency as LocationCurrency,
        locationTimeZone: location.locationTimeZone,
        locationSIUnit: location.locationSIUnit,
        locationAddressLine1: location.locationAddressLine1,
        locationAddressLine2: location.locationAddressLine2,
        locationCity: location.locationCity,
        locationState: location.locationState,
        locationCountry: location.locationCountry,
        locationPostcode: location.locationPostcode,
        locationApproved: location.locationApproved,
        locationApprovedAt: location.locationApprovedAt,
        locationCreatedAt: location.locationCreatedAt,
        locationDeletedAt: location.locationDeletedAt,
      };

      res.status(200).send(retrievedLocationResponse);
      return;
    }

    const retrievedLocation = await LocationService.getLocationById(locationId);

    // cache locaation
    await RedisService.set(
      `location:${locationId}`,
      JSON.stringify(retrievedLocation)
    );

    if (!retrievedLocation) {
      const methodName = "getLocationByEmailHandler";
      const message = "Location does not exist.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "errors.txt"
      );
      throw new NotFoundError(message);
    }

    const retrievedLocationResponse: LocationResponse = {
      locationId: retrievedLocation._id,
      locationLegalName: retrievedLocation.locationLegalName,
      locationUserEmail: retrievedLocation.locationUserEmail,
      locationEmail: retrievedLocation.locationEmail,
      locationIndustry: retrievedLocation.locationIndustry,
      locationRegion: retrievedLocation.locationRegion as LocationRegion,
      locationCurrency: retrievedLocation.locationCurrency as LocationCurrency,
      locationTimeZone: retrievedLocation.locationTimeZone,
      locationSIUnit: retrievedLocation.locationSIUnit,
      locationAddressLine1: retrievedLocation.locationAddressLine1,
      locationAddressLine2: retrievedLocation.locationAddressLine2,
      locationCity: retrievedLocation.locationCity,
      locationState: retrievedLocation.locationState,
      locationCountry: retrievedLocation.locationCountry,
      locationPostcode: retrievedLocation.locationPostcode,
      locationApproved: retrievedLocation.locationApproved,
      locationApprovedAt: retrievedLocation.locationApprovedAt || null,
      locationCreatedAt: retrievedLocation.locationCreatedAt,
      locationDeletedAt: retrievedLocation.locationDeletedAt || null,
    };

    res.status(200).send(retrievedLocationResponse);
  }
);

export { getLocationByEmailHandler };
