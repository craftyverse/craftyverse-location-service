import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import { NotFoundError, requireAuth } from "@craftyverse-au/craftyverse-common";
import redisClient from "../services/redis-service";
import { LocationDeletedPublisher } from "../events/publishers/location-deleted-publisher";
import { natsWrapper } from "../services/nats-wrapper";

const router = express.Router();

router.delete(
  "/api/location/deleteLocationById/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const locationId = req.params.id;

    const existingLocation = await Location.findById(locationId);

    if (!existingLocation) {
      throw new NotFoundError("This location does not exist!");
    }

    await Location.findByIdAndRemove({ _id: locationId });

    redisClient.remove(locationId);
    new LocationDeletedPublisher(natsWrapper.client).publish({
      locationId,
    });
    res.status(200).send("Your location has been successfully deleted");
  }
);

export { router as deleteLocationById };
