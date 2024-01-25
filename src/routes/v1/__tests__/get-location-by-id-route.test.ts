import request from "supertest";
import { app } from "../../../app";
import { Location } from "../../../model/location";
import mongoose from "mongoose";
import { awsConfigUtils } from "../../../../config/aws-config";
import redis from "ioredis-mock";
import { RedisService } from "../../../services/redis";

jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));

describe("## GET /api/location/v1/:locationId", () => {
  const locationMock = {
    locationLegalName: "Crafftyverse",
    locationUserEmail: "tony.li@test.io",
    locationEmail: "tony.li1@test.io",
    locationIndustry: "Arts and Crafts",
    locationRegion: "AUS",
    locationCurrency: "AUD",
    locationTimeZone: "AWST",
    locationSIUnit: "KG",
    locationAddressLine1: "24 Delaney Drive",
    locationAddressLine2: "Baulkham Hills",
    locationCity: "Sydney",
    locationState: "NSW",
    locationCountry: "Australia",
    locationPostcode: "2153",
    locationApproved: false,
  };
  describe("# Request validation", () => {
    const mockLocationId = new mongoose.Types.ObjectId().toHexString();

    it("should return a 404 (NotFound) if the location is not found", async () => {
      await request(app)
        .get(`/api/location/v1/${mockLocationId}`)
        .set("Authorization", global.signup())
        .expect(404);
    });

    it("should return a 401 (NotAuthorizedError) if the user is not authenticated", async () => {
      const response = await request(app)
        .get(`/api/location/v1/${mockLocationId}`)
        .expect(401);

      expect(response.body).toEqual({
        errors: [{ field: "NotAuthorised", message: "Not authorised" }],
      });
    });
  });

  describe("# Cache validation", () => {
    it("should return a location from the cache if it exists", async () => {
      // creating a location via the createLocation route
      jest.spyOn(awsConfigUtils, "getTopicArns").mockReturnValue(
        Promise.resolve({
          "location-created":
            "arn:aws:sns:ap-southeast-2:000000000000:location-created",
        })
      );

      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);
      console.log("This is the response: ", response.body);

      expect(response.body).toEqual({
        ...locationMock,
        locationUserEmail: "tony.li@test.io",
        _id: expect.any(String),
        __v: expect.any(Number),
      });

      // retrieving the location from the cache
      await request(app)
        .get(`/api/location/v1/${response.body._id}`)
        .set("Authorization", global.signup())
        .expect(200);
    });

    it("should return a location from the database and set the location to the cache if it does not exist in the cache", async () => {
      const cachedLocation = jest.spyOn(RedisService, "set");
      const location = Location.build({
        ...locationMock,
      });

      const savedLocation = await location.save();
      console.log(savedLocation);

      await request(app)
        .get(`/api/location/v1/${savedLocation._id}`)
        .set("Authorization", global.signup())
        .expect(200);

      expect(RedisService.set).toHaveBeenCalledTimes(1);

      cachedLocation.mockRestore();
    });
  });
});
