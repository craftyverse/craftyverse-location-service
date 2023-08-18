import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createLocationRouter } from './routes/create-location-route';
import { getLocationByIdRouter } from './routes/get-location-by-id-route';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@craftyverse-au/craftyverse-common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

// Placeholder for location service route
app.use(createLocationRouter);
app.use(getLocationByIdRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
