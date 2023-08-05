import express, { Request, Response } from 'express';
import { createLocationRequestSchema } from '../schemas/create-location-schema';
import {
  RequestValidationError,
  requireAuth,
} from '@craftyverse-au/craftyverse-common';

const router = express.Router();

router.post(
  '/api/location/createLocation',
  requireAuth,
  async (req: Request, res: Response) => {
    const requestData = createLocationRequestSchema.safeParse(req.body);

    if (!requestData.success) {
      throw new RequestValidationError(requestData.error.issues);
    }

    const location = requestData.data;

    res.status(201).send(location);
  }
);

export { router as createLocationRouter };
