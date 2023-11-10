import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import redisClient from "../../services/redis-service";
import Redis from "ioredis";
import { NewLocationRequest } from "../../schemas/location-schema";

describe("GET /api/location/getLocationByEmail/:email", () => {
  let testClient: Redis;
  const payload: NewLocationRequest = {
    locationName: "Tony",
    locationFirstName: "Tony",
    locationLastName: "Li",
    locationEmail: "tony.li@test.io",
    locationIndustry: "Crafts",
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
    testClient = redisClient.getClient({
      host: "localhost",
      port: 6379,
      password: "password",
    });
  });

  afterAll(() => {
    redisClient.quit();
  });
  describe("## Response validation", () => {
    it("should return a 401 if the user is not authenticated", async () => {
      const locationId = new mongoose.Types.ObjectId().toHexString();
      await request(app)
        .get(`/api/location/getLocationByEmail/${locationId}`)
        .send()
        .expect(401);
    });
    it("should return a 404 status if the location is not found and return a message of 'The location you have requested does not exist'", async () => {
      const getLocationByEmailResponse = await request(app)
        .get("/api/location/getLocationByEmail/asdfgeearg")
        .set("Cookie", global.signup())
        .send()
        .expect(404);

      expect(getLocationByEmailResponse.body).toEqual({
        errors: [
          {
            message: "The location you have requested does not exist",
            field: "NotFound",
          },
        ],
      });
    });

    it("should only return the fields that are specified in the query param array", async () => {
      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocationByEmail/${createLocationResponse.body.locationEmail}?fields=locationId,locationTimeZone`
        )
        .set("Cookie", cookie)
        .send()
        .expect(200);

      const getLocationResponseBody = getLocationResponse.body;
      expect(getLocationResponseBody.locationTimeZone).toEqual(
        payload.locationTimeZone
      );
    });

    it("should return the full object if there is no query parameters defined", async () => {
      const cookie = global.signup();
      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocationByEmail/${createLocationResponse.body.locationEmail}`
        )
        .set("Cookie", cookie)
        .send()
        .expect(200);

      expect(getLocationResponse.body).toEqual({
        locationId: createLocationResponse.body.locationId,
        locationUserId: createLocationResponse.body.locationUserId,
        locationName: "Tony",
        locationFirstName: "Tony",
        locationLastName: "Li",
        locationEmail: "tony.li@test.io",
        locationIndustry: "Crafts",
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
        __v: 0,
      });
    });
  });
});
