import express from "express";
import cors from "cors";
import { corsOptions } from "../config/cors-options";
import { logger } from "./middleware/log-events";
import { credentials } from "./middleware/credentials";

import { v1LocationRouter } from "./routes/v1/location-routes";
import {
  NotFoundError,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";

const app = express();

app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/location/v1", v1LocationRouter);

app.all("*", () => {
  const message = "The route that you have requested does not exist";
  throw new NotFoundError(message);
});

app.use(errorHandler);

export { app };
