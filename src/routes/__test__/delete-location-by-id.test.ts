import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Redis } from "ioredis";
import redisClient from "../../services/redis-service";
import { natsWrapper } from "../../services/nats-wrapper";

describe("DELETE /api/location/deleteLocationById/:id", () => {
  let testClient: Redis;
  const payload = {
    locationName: "Tony",
    locationEmail: "tony.li@test.io",
    locationIndustry: "Crafts",
    locationRegion: "AUS",
    locationCurrency: "AUD",
    locationTimeZone: "1691220336946",
    locationSIUnit: "KG",
    locationLegalBusinessName: "Craftyverse",
    locationLegalAddressLine1: "21 George St",
    locationLegalAddressLine2: "Sydney",
    locationLegalCity: "Sydney",
    locationLegalState: "NSW",
    locationLegalCountry: "Australia",
    locationLegalPostcode: "2000",
    locationApproved: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    testClient = redisClient.getClient({
      host: "localhost",
      port: 6379,
      password: "password",
    });
  });

  afterAll(() => {
    redisClient.quit();
  });
  describe("## Request validation", () => {
    it("should return a 401 (unauthorised) if the user is not authenticated", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const deleteLocationResponse = await request(app)
        .delete(`/api/location/deleteLocationById/${id}`)
        .send({});

      expect(deleteLocationResponse.status).toBe(401);
    });

    it("should return a 404 (Not found) error if the location does not exist with the message 'This location does not exist!' ", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const deleteLocationResponse = await request(app)
        .delete(`/api/location/deleteLocationById/${id}`)
        .set("Cookie", global.signup())
        .send({});

      expect(deleteLocationResponse.status).toBe(404);
      expect(deleteLocationResponse.body).toEqual({
        errors: [
          { field: "NotFound", message: "This location does not exist!" },
        ],
      });
    });

    it("should successfully delete the location", async () => {
      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      await request(app)
        .delete(
          `/api/location/deleteLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .expect(200);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send()
        .expect(404);

      expect(getLocationResponse.body).toEqual({
        errors: [
          {
            message: "The location that you have requested does not exist",
            field: "NotFound",
          },
        ],
      });
    });
  });

  describe("## Event publishing validation", () => {
    it("should successfully publish a LocationDeletedEvent upon successful location deletion", async () => {
      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      await request(app)
        .delete(
          `/api/location/deleteLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .expect(200);

      expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send()
        .expect(404);

      expect(getLocationResponse.body).toEqual({
        errors: [
          {
            message: "The location that you have requested does not exist",
            field: "NotFound",
          },
        ],
      });
    });
  });
});
