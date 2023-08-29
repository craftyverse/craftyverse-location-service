import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import redisClient from "../../services/redis-service";
import Redis from "ioredis";

describe("PATCH /api/location/patchLocation/:id", () => {
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

  describe("## Request validation", () => {
    it("should return a 400 status if the request email update is not valid", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const patchLocationRespone = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(400);

      expect(patchLocationRespone.body).toEqual({
        errors: [
          {
            message: "you must provide a valid email.",
            field: "locationEmail",
          },
        ],
      });
    });

    it("should return a 400 status if the requested locationRegion is not supported.", async () => {
      const updatedFields = {
        locationRegion: "JAP",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const patchLocationRespone = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(400);

      expect(patchLocationRespone.body).toEqual({
        errors: [
          {
            message:
              "Invalid enum value. Expected 'AUS' | 'ENG' | 'USA' | 'CHN', received 'JAP'",
            field: "locationRegion",
          },
        ],
      });
    });

    it("should return a 400 status if the requested locationSIUnit is not supported.", async () => {
      const updatedFields = {
        locationSIUnit: "POUND",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const patchLocationRespone = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(400);

      expect(patchLocationRespone.body).toEqual({
        errors: [
          {
            message:
              "Invalid enum value. Expected 'LB' | 'KG', received 'POUND'",
            field: "locationSIUnit",
          },
        ],
      });
    });

    it("should return a 400 status if the requested locationCurrency is not supported", async () => {
      const updatedFields = {
        locationCurrency: "RUPES",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const patchLocationRespone = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(400);

      expect(patchLocationRespone.body).toEqual({
        errors: [
          {
            message:
              "Invalid enum value. Expected 'AUD' | 'USD' | 'RMB', received 'RUPES'",
            field: "locationCurrency",
          },
        ],
      });
    });
  });
  describe("## Response validation", () => {
    it("should return a 404 (NotFoundError) status if the provided locationId does not exist", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail.com.au",
      };

      const id = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app)
        .patch(`/api/location/patchLocationById/${id}`)
        .set("Cookie", global.signup())
        .send({ ...updatedFields });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        errors: [{ message: "The location does not exist", field: "NotFound" }],
      });
    });

    it("should return a 401 status of the user is not authenticated", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail.com.au",
      };

      const id = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app)
        .patch(`/api/location/patchLocationById/${id}`)
        .send({ ...updatedFields });

      expect(response.status).toEqual(401);
    });

    it("should return a 401 if the user does not own the request location", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail.com.au",
      };

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload });

      await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", global.signup())
        .send({ ...updatedFields })
        .expect(401);
    });

    it("should update the location with the correct inputs", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail.com.au",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const patchLocationResponse = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(200);

      expect(patchLocationResponse.body).toEqual({
        locationId: createLocationResponse.body.locationId,
        locationUserId: createLocationResponse.body.locationUserId,
        locationName: "Tony",
        locationEmail: updatedFields.locationEmail,
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
      });
    });
  });

  describe("## cache validation", () => {
    it("should update the cache with the new fields", async () => {
      const updatedFields = {
        locationEmail: "tony.li@testemail.com.au",
      };

      const cookie = global.signup();

      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", cookie)
        .send({ ...payload });

      const cachedLocation = await redisClient.get(
        createLocationResponse.body.locationId
      );

      expect(cachedLocation).toEqual(
        `{"locationId":"${createLocationResponse.body.locationId}","locationUserId":"${createLocationResponse.body.locationUserId}","locationName":"Tony","locationEmail":"tony.li@test.io","locationIndustry":"Crafts","locationRegion":"AUS","locationCurrency":"AUD","locationTimeZone":"1691220336946","locationSIUnit":"KG","locationLegalBusinessName":"Craftyverse","locationLegalAddressLine1":"21 George St","locationLegalAddressLine2":"Sydney","locationLegalCity":"Sydney","locationLegalState":"NSW","locationLegalCountry":"Australia","locationLegalPostcode":"2000"}`
      );

      const patchLocationResponse = await request(app)
        .patch(
          `/api/location/patchLocationById/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send({ ...updatedFields })
        .expect(200);

      expect(patchLocationResponse.body).toEqual({
        locationId: createLocationResponse.body.locationId,
        locationUserId: createLocationResponse.body.locationUserId,
        locationName: "Tony",
        locationEmail: updatedFields.locationEmail,
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
      });

      const updatedCacheLocation = await testClient.get(
        patchLocationResponse.body.locationId
      );

      console.log(updatedCacheLocation);

      expect(updatedCacheLocation).toEqual(
        `{"locationId":"${patchLocationResponse.body.locationId}","locationUserId":"${patchLocationResponse.body.locationUserId}","locationName":"Tony","locationEmail":"tony.li@testemail.com.au","locationIndustry":"Crafts","locationRegion":"AUS","locationCurrency":"AUD","locationTimeZone":"1691220336946","locationSIUnit":"KG","locationLegalBusinessName":"Craftyverse","locationLegalAddressLine1":"21 George St","locationLegalAddressLine2":"Sydney","locationLegalCity":"Sydney","locationLegalState":"NSW","locationLegalCountry":"Australia","locationLegalPostcode":"2000"}`
      );
    });
  });
});
