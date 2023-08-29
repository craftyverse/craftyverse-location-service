import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { createLocationRouter } from "./routes/create-location-route";
import { getLocationByIdRouter } from "./routes/get-location-by-id-route";
import { patchLocationByIdRouter } from "./routes/patch-location-by-id-route";
import { getLocationByEmailRouter } from "./routes/get-location-by-email";
import { deleteLocationById } from "./routes/delete-location-by-id";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createLocationRouter);
app.use(createLocationRouter);
app.use(getLocationByIdRouter);
app.use(patchLocationByIdRouter);
app.use(getLocationByEmailRouter);
app.use(deleteLocationById);

app.all("*", async () => {
  throw new NotFoundError("The route that you have requested does not exist");
});

app.use(errorHandler);

export { app };
