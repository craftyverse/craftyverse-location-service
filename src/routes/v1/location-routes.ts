import express, { Request, Response } from "express";
import { verifyJWT } from "@craftyverse-au/craftyverse-common";

import { createLocationHandler } from "../../controllers/create-location-controller";
import { getLocationByEmailHandler } from "../../controllers/get-location-by-id-controller";
import { getAllLocationsByUserEmailHandler } from "../../controllers/get-all-locations-by-user-email-controller";

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

export { router as v1LocationRouter };
