import express, { Request, Response } from "express";
import { verifyJWT } from "@craftyverse-au/craftyverse-common";

import { createLocationHandler } from "../../controllers/create-location-controller";
import { getLocationByEmailHandler } from "../../controllers/get-location-by-id-controller";
import { getAllLocationsByUserEmailHandler } from "../../controllers/get-all-locations-by-user-email-controller";
import { updateLocationByIdHandler } from "../../controllers/update-location-by-id-controller";

const router = express.Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  // There will be more to this route.
  res.status(200).json({
    health: "OK",
  });
});

router.post("/createlocation", verifyJWT, createLocationHandler);
router.get("/:locationId", verifyJWT, getLocationByEmailHandler);
router.get("/email/:userEmail", verifyJWT, getAllLocationsByUserEmailHandler);
router.patch("/:locationId", verifyJWT, updateLocationByIdHandler);

export { router as v1LocationRouter };
