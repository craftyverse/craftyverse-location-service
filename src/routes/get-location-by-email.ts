import express, { Request, Response } from 'express';
import { Location } from '../models/Location';
import {
  BadRequestError,
  RequestValidationError,
  requireAuth,
  NotAuthorisedError,
  NotFoundError,
} from '@craftyverse-au/craftyverse-common';
import {
  LocationRequestSchema,
  LocationResponse,
} from '../schemas/location-schema';

const router = express.Router();

router.get(
  '/api/location/getLocationByEmail/:email',
  requireAuth,
  async (req: Request, res: Response) => {
    const locationEmailParam: string = req.params.email;
    const requestQueryFields: string | undefined =
      req.query?.fields?.toString();

    const existingLocation = await Location.findOne({
      locationEmail: locationEmailParam,
    });

    if (!existingLocation) {
      throw new NotFoundError('The location you have requested does not exist');
    }
  }
);

export { router as getLocationByEmailRouter };
