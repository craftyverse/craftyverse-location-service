import express, { Request, Response } from 'express';
import {
  LocationRequestSchema,
  NewLocationRequest,
  LocationResponse,
} from '../schemas/location-schema';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';
import redisClient from '../services/redis-service';

import { Location } from '../models/Location';

const router = express.Router();

router.post(
  '/api/location/createLocation',
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
      throw new BadRequestError('This location already exists');
    }
    const createdLocation = Location.build({
      // This needs to change to the actual userId
      locationUserId: '001',
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
    });

    const savedLocation = await createdLocation.save();

    const createLocation: LocationResponse = {
      locationId: savedLocation.id,
      locationUserId: createdLocation.locationUserId,
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
    };

    redisClient.set(createLocation.locationId, createLocation);

    res.status(201).send({ ...(createLocation as LocationResponse) });
  }
);

export { router as createLocationRouter };
