import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import { NotFoundError, requireAuth } from "@craftyverse-au/craftyverse-common";

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

    const deleteResponse = await Location.deleteOne({ id: locationId });
    res.status(200).send();
  }
);

export { router as deleteLocationById };
