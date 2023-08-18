import express, { Request, Response } from 'express';
import { LocationRequestSchema, NewLocation } from '../schemas/location-schema';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';
import redisClient from '../services/redis-service';

import { Location } from '../models/Location';

const router = express.Router();

type createLocaitonResponse = {
  locationId: string;
  locationName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: string;
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: string;
  locationLegalBusinessName: string;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string;
  locationLegalCity: string;
  locationLegalState: string;
  locationLegalCountry: string;
  locationLegalPostcode: string;
};

router.post(
  '/api/location/createLocation',
  requireAuth,
  async (req: Request, res: Response) => {
    const requestData = LocationRequestSchema.safeParse(req.body);

    if (!requestData.success) {
      throw new RequestValidationError(requestData.error.issues);
    }

    const location: NewLocation = requestData.data;

    const existingLocation = await Location.findOne({
      locationEmail: location.locationEmail,
    });

    if (existingLocation) {
      throw new BadRequestError('This location already exists');
    }
    const createdLocation = Location.build({
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

    await createdLocation.save();

    const createLocation: createLocaitonResponse = {
      locationId: createdLocation.id,
      locationName: createdLocation.locationName,
      locationEmail: createdLocation.locationEmail,
      locationIndustry: createdLocation.locationIndustry,
      locationRegion: createdLocation.locationRegion,
      locationCurrency: createdLocation.locationCurrency,
      locationTimeZone: createdLocation.locationTimeZone,
      locationSIUnit: createdLocation.locationSIUnit,
      locationLegalBusinessName: createdLocation.locationLegalBusinessName,
      locationLegalAddressLine1: createdLocation.locationLegalAddressLine1,
      locationLegalAddressLine2: createdLocation.locationLegalAddressLine2,
      locationLegalCity: createdLocation.locationLegalCity,
      locationLegalState: createdLocation.locationLegalState,
      locationLegalCountry: createdLocation.locationLegalCountry,
      locationLegalPostcode: createdLocation.locationLegalPostcode,
    };

    // TODO: We'll need to inplement a redis cache database so that it won't hit the underlying database everytime it reads
    redisClient.set(createLocation.locationId, createLocation);
    const cachedLocation = redisClient.get(createLocation.locationId);

    res.status(201).send({ ...(createLocation as createLocaitonResponse) });
  }
);

export { router as createLocationRouter };
