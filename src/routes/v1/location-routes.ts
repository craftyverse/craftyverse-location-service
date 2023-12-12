import express, { Request, Response } from "express";
import { verifyJWT } from "@craftyverse-au/craftyverse-common";

import { createLocationHandler } from "../../controllers/create-location-controller";

const router = express.Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  // There will be more to this route.
  res.status(200).json({
    health: "OK",
  });
});

router.post("/createlocation", verifyJWT, createLocationHandler);

export { router as v1LocationRouter };
