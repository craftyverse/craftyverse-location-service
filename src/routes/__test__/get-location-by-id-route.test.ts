import request from "supertest";
import { app } from "../../app";
import { redisClient } from "@craftyverse-au/craftyverse-common";
import { Redis } from "ioredis";
import { Location } from "../../models/Location";
import mongoose from "mongoose";

describe("GET /api/location/getLocation/:id", () => {
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
    locationFirstName: "Tony",
    locationLastName: "Li",
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
    it("should return a 404 status if the location is not found", async () => {
      const locationId = new mongoose.Types.ObjectId().toHexString();
      const getLocationResponse = await request(app)
        .get(`/api/location/getLocation/${locationId}`)
        .set("Cookie", global.signup())
        .send()
        .expect(404);
    });

    it("should return the ticket if the location is found", async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload)
        .expect(201);

      await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", global.signup())
        .send()
        .expect(200);
    });

    it("should only return the fields that are specified in the query param array", async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}?fields=locationId,locationTimeZone`
        )
        .set("Cookie", global.signup())
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
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", cookie)
        .send()
        .expect(200);

      expect(getLocationResponse.body).toEqual({
        locationId: createLocationResponse.body.locationId,
        locationUserId: createLocationResponse.body.locationUserId,
        locationName: "Tony",
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
        locationFirstName: "Tony",
        locationLastName: "Li",
        locationApproved: false,
      });
    });
  });

  describe("## Cache validation", () => {
    it("should retrieve the full location from the redis cache if the location exists in the cache", async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set("Cookie", global.signup())
        .send()
        .expect(200);

      const cachedLocation = await testClient.get(
        getLocationResponse.body.locationId
      );

      expect(cachedLocation).toEqual(
        `{"locationId":"${getLocationResponse.body.locationId}","locationUserId":"${getLocationResponse.body.locationUserId}","locationName":"Tony","locationFirstName":"Tony","locationLastName":"Li","locationEmail":"tony.li@test.io","locationIndustry":"Crafts","locationCurrency":"AUD","locationTimeZone":"1691220336946","locationSIUnit":"KG","locationLegalBusinessName":"Craftyverse","locationLegalAddressLine1":"21 George St","locationLegalAddressLine2":"Sydney","locationLegalCity":"Sydney","locationLegalState":"NSW","locationLegalCountry":"Australia","locationLegalPostcode":"2000","locationApproved":false}`
      );
    });

    it("should populate the redis cache if the location does not exist in the cache", async () => {
      enum locationRegion {
        Australia = "AUS",
        England = "ENG",
        America = "USA",
        China = "CHN",
      }

      enum locationCurrency {
        ausDollar = "AUD",
        usDollar = "USD",
        chnDollar = "RMB",
      }

      enum locationSIUnit {
        pound = "LB",
        kilo = "KG",
      }

      const createdLocation = Location.build({
        locationUserId: "001",
        locationName: payload.locationName,
        locationEmail: payload.locationEmail,
        locationIndustry: payload.locationIndustry,
        locationCurrency: locationCurrency.ausDollar,
        locationTimeZone: payload.locationTimeZone,
        locationSIUnit: locationSIUnit.kilo,
        locationLegalBusinessName: payload.locationLegalBusinessName,
        locationLegalAddressLine1: payload.locationLegalAddressLine1,
        locationLegalAddressLine2: payload.locationLegalAddressLine2,
        locationLegalCity: payload.locationLegalCity,
        locationLegalState: payload.locationLegalState,
        locationLegalCountry: payload.locationLegalCountry,
        locationLegalPostcode: payload.locationLegalPostcode,
        locationApproved: payload.locationApproved,
        locationFirstName: payload.locationFirstName,
        locationLastName: payload.locationLastName,
      });

      const savedLocation = await createdLocation.save();

      const location = await request(app)
        .get(`/api/location/getLocation/${savedLocation.id}`)
        .set("Cookie", global.signup())
        .send()
        .expect(200);

      const cachedLocation = await testClient.get(savedLocation.id);

      expect(cachedLocation).toEqual(
        `{"locationId":"${createdLocation.id}","locationUserId":"${createdLocation.locationUserId}","locationName":"Tony","locationEmail":"tony.li@test.io","locationIndustry":"Crafts","locationCurrency":"AUD","locationTimeZone":"1691220336946","locationSIUnit":"KG","locationLegalBusinessName":"Craftyverse","locationLegalAddressLine1":"21 George St","locationLegalAddressLine2":"Sydney","locationLegalCity":"Sydney","locationLegalState":"NSW","locationLegalCountry":"Australia","locationLegalPostcode":"2000","locationApproved":false,"locationFirstName":"Tony","locationLastName":"Li"}`
      );
    });
  });
});
