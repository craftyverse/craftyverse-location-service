import express, { Request, Response } from 'express';
import { Location } from '../models/Location';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
  NotAuthorisedError,
  NotFoundError,
} from '@craftyverse-au/craftyverse-common';
import { PatchLocationfieldSchema } from '../schemas/patch-location-schema';

import { LocationResponse } from '../schemas/location-schema';

const router = express.Router();

router.patch(
  '/api/location/patchLocationById/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const locationId = req.params.id;
    const patchLocationFields = req.body;
    const patchLocationFieldRequestData =
      PatchLocationfieldSchema.safeParse(patchLocationFields);

    if (!patchLocationFieldRequestData.success) {
      throw new RequestValidationError(
        patchLocationFieldRequestData.error.issues
      );
    }

    const existingLocation = await Location.findById(locationId);

    if (!existingLocation) {
      throw new NotFoundError('The location does not exist');
    }

    if (existingLocation.locationUserId !== req.currentUser!.userId) {
      throw new NotAuthorisedError();
    }
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      { $set: { ...patchLocationFields } },
      { new: true }
    );

    if (!updatedLocation) {
      throw new BadRequestError('We could not update your location');
    }

    const updatedLocationResponsePayload: LocationResponse = {
      locationId: updatedLocation.id,
      locationUserId: updatedLocation.locationUserId,
      locationName: updatedLocation.locationName,
      locationEmail: updatedLocation.locationEmail,
      locationIndustry: updatedLocation.locationIndustry,
      locationRegion: updatedLocation.locationRegion,
      locationCurrency: updatedLocation.locationCurrency,
      locationTimeZone: updatedLocation.locationTimeZone,
      locationSIUnit: updatedLocation.locationSIUnit,
      locationLegalBusinessName: updatedLocation.locationLegalBusinessName,
      locationLegalAddressLine1: updatedLocation.locationLegalAddressLine1,
      locationLegalAddressLine2: updatedLocation.locationLegalAddressLine2,
      locationLegalCity: updatedLocation.locationLegalCity,
      locationLegalState: updatedLocation.locationLegalState,
      locationLegalCountry: updatedLocation.locationLegalCountry,
      locationLegalPostcode: updatedLocation.locationLegalPostcode,
    };

    res.status(200).send(updatedLocationResponsePayload);
  }
);

export { router as patchLocationByIdRouter };
