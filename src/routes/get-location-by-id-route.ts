import express, { Request, Response } from 'express';
import { Location } from '../models/Location';
import {
  NotFoundError,
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';
import { LocationRequestSchema } from '../schemas/location-schema';

const router = express.Router();

router.get(
  '/api/location/getLocation/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    console.log('Request body: ', req.body);

    const existingLocation = await Location.findById(req.params.id);

    if (!existingLocation) {
      throw new NotFoundError();
    }

    const requestFieldsString = req.query.fields?.toString();

    if (!requestFieldsString) {
      res.send(existingLocation);
      return;
    }
    const requestFieldsArray = requestFieldsString.split(',');
    console.log(
      'Query params',
      typeof requestFieldsString,
      requestFieldsString
    );

    const filteredLocation: Record<string, any> = {};

    requestFieldsArray.map((field: string) => {
      console.log(field);
      const fieldValue = existingLocation.get(field);
      if (fieldValue !== undefined) {
        filteredLocation[field] = fieldValue;
      }
    });

    res.send(filteredLocation);
  }
);

export { router as getLocationByIdRouter };
