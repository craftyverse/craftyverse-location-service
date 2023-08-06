import express, { Request, Response } from 'express';
import { createLocationRequestSchema, NewLocation } from '../schemas/create-location-schema';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';

import { Location } from '../models/Location'

const router = express.Router();

router.post(
  '/api/location/createLocation',
  requireAuth,
  async (req: Request, res: Response) => {
    const requestData = createLocationRequestSchema.safeParse(req.body);

    if (!requestData.success) {
      throw new RequestValidationError(requestData.error.issues);
    }

    const location: NewLocation = requestData.data;

    const existingLocation = await Location.findOne({locationEmail: location.locationEmail})

    if (!existingLocation) {
      throw new BadRequestError("This location doesn't seem to exist!")
    }

    const createdLocation = Location.build({
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

    res.status(201).send(location);
  }
);

export { router as createLocationRouter };
