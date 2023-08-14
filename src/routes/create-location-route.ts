import express, { Request, Response } from 'express';
import {
  createLocationRequestSchema,
  NewLocation,
} from '../schemas/create-location-schema';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';

import { Location } from '../models/Location';
import { redisClient } from '../services/redis-service';

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
    const requestData = createLocationRequestSchema.safeParse(req.body);

    if (!requestData.success) {
      throw new RequestValidationError(requestData.error.issues);
    }

    const location: NewLocation = requestData.data;

    const existingLocation = await Location.findOne({
      locationEmail: location.locationEmail,
    });

    if (!existingLocation) {
      const createdLocation = Location.build({
        locationUserId: req.currentUser!.id,
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

      const createLocationResponse: createLocaitonResponse = {
        locationId: savedLocation.id,
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

      // TODO: We'll need to inplement a redis cache database so that it won't hit the underlying database everytime it reads
      // await redisClient.set(savedLocation.id, JSON.stringify(savedLocation));

      res.status(201).send({ ...createLocationResponse });
    }

    res.status(201).send(existingLocation);
  }
);

export { router as createLocationRouter };
