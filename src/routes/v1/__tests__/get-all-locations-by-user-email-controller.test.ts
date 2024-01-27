import request from "supertest";
import { app } from "../../../app";
import { Location } from "../../../model/location";
import mongoose from "mongoose";

describe("## GET /api/location/v1/email/:userEmail", () => {
  const location1Mock = {
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

  const location2Mock = {
    locationLegalName: "CraftyHub",
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
    it("should return a 401 (NotAuthorizedError) if the user is not authenticated", async () => {
      const response = await request(app)
        .get(`/api/location/v1/email/${location1Mock.locationUserEmail}`)
        .expect(401);

      expect(response.body).toEqual({
        errors: [{ field: "NotAuthorised", message: "Not authorised" }],
      });
    });

    it("should return an empty list of locations if there is an invalid user email present in the request", async () => {
      const userEmail = " ";
      const response = await request(app)
        .get(`/api/location/v1/email/${userEmail}?limit=10&page=1`)
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations).toEqual([]);
    });

    it("should return an empty list of locations if there is an invalid limit present in the request", async () => {
      const response = await request(app)
        .get(
          `/api/location/v1/email/${location1Mock.locationUserEmail}?limit=0&page=1`
        )
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations).toEqual([]);
    });

    it("should return an empty list of locations if there is an invalid page present in the request", async () => {
      const response = await request(app)
        .get(
          `/api/location/v1/email/${location1Mock.locationUserEmail}?limit=10&page=1`
        )
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations).toEqual([]);
    });
  });

  describe("# Route handler validation", () => {
    it("should return a list of locations if it exists in the database (with limit and page query params)", async () => {
      const location1 = Location.build(location1Mock);
      await location1.save();

      const location2 = Location.build(location2Mock);
      await location2.save();

      const response = await request(app)
        .get(
          `/api/location/v1/email/${location1Mock.locationUserEmail}?limit=10&page=1`
        )
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations.length).toEqual(2);
      expect(response.body).toEqual({
        locations: [
          {
            _id: location1._id.toString(),
            locationLegalName: location1Mock.locationLegalName,
            locationUserEmail: location1Mock.locationUserEmail,
            locationEmail: location1Mock.locationEmail,
            locationIndustry: location1Mock.locationIndustry,
            locationRegion: location1Mock.locationRegion,
            locationCurrency: location1Mock.locationCurrency,
            locationTimeZone: location1Mock.locationTimeZone,
            locationSIUnit: location1Mock.locationSIUnit,
            locationAddressLine1: location1Mock.locationAddressLine1,
            locationAddressLine2: location1Mock.locationAddressLine2,
            locationCity: location1Mock.locationCity,
            locationState: location1Mock.locationState,
            locationCountry: location1Mock.locationCountry,
            locationPostcode: location1Mock.locationPostcode,
            locationApproved: location1Mock.locationApproved,
            __v: 0,
          },
          {
            _id: location2._id.toString(),
            locationLegalName: location2Mock.locationLegalName,
            locationUserEmail: location2Mock.locationUserEmail,
            locationEmail: location2Mock.locationEmail,
            locationIndustry: location2Mock.locationIndustry,
            locationRegion: location2Mock.locationRegion,
            locationCurrency: location2Mock.locationCurrency,
            locationTimeZone: location2Mock.locationTimeZone,
            locationSIUnit: location2Mock.locationSIUnit,
            locationAddressLine1: location2Mock.locationAddressLine1,
            locationAddressLine2: location2Mock.locationAddressLine2,
            locationCity: location2Mock.locationCity,
            locationState: location2Mock.locationState,
            locationCountry: location2Mock.locationCountry,
            locationPostcode: location2Mock.locationPostcode,
            locationApproved: location2Mock.locationApproved,
            __v: 0,
          },
        ],
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should return a list of locations if it exists in the database (without limit and page query params)", async () => {
      const location1 = Location.build(location1Mock);
      await location1.save();

      const location2 = Location.build(location2Mock);
      await location2.save();

      const response = await request(app)
        .get(`/api/location/v1/email/${location1Mock.locationUserEmail}`)
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations.length).toEqual(2);
      expect(response.body).toEqual({
        locations: [
          {
            _id: location1._id.toString(),
            locationLegalName: location1Mock.locationLegalName,
            locationUserEmail: location1Mock.locationUserEmail,
            locationEmail: location1Mock.locationEmail,
            locationIndustry: location1Mock.locationIndustry,
            locationRegion: location1Mock.locationRegion,
            locationCurrency: location1Mock.locationCurrency,
            locationTimeZone: location1Mock.locationTimeZone,
            locationSIUnit: location1Mock.locationSIUnit,
            locationAddressLine1: location1Mock.locationAddressLine1,
            locationAddressLine2: location1Mock.locationAddressLine2,
            locationCity: location1Mock.locationCity,
            locationState: location1Mock.locationState,
            locationCountry: location1Mock.locationCountry,
            locationPostcode: location1Mock.locationPostcode,
            locationApproved: location1Mock.locationApproved,
            __v: 0,
          },
          {
            _id: location2._id.toString(),
            locationLegalName: location2Mock.locationLegalName,
            locationUserEmail: location2Mock.locationUserEmail,
            locationEmail: location2Mock.locationEmail,
            locationIndustry: location2Mock.locationIndustry,
            locationRegion: location2Mock.locationRegion,
            locationCurrency: location2Mock.locationCurrency,
            locationTimeZone: location2Mock.locationTimeZone,
            locationSIUnit: location2Mock.locationSIUnit,
            locationAddressLine1: location2Mock.locationAddressLine1,
            locationAddressLine2: location2Mock.locationAddressLine2,
            locationCity: location2Mock.locationCity,
            locationState: location2Mock.locationState,
            locationCountry: location2Mock.locationCountry,
            locationPostcode: location2Mock.locationPostcode,
            locationApproved: location2Mock.locationApproved,
            __v: 0,
          },
        ],
        totalPages: null,
        currentPage: null,
      });
    });

    it("should return the first location if the limit param is set to 1", async () => {
      const location1 = Location.build(location1Mock);
      await location1.save();

      const location2 = Location.build(location2Mock);
      await location2.save();

      const response = await request(app)
        .get(
          `/api/location/v1/email/${location1Mock.locationUserEmail}?limit=1&page=1`
        )
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations.length).toEqual(1);
      expect(response.body).toEqual({
        locations: [
          {
            _id: location1._id.toString(),
            locationLegalName: location1Mock.locationLegalName,
            locationUserEmail: location1Mock.locationUserEmail,
            locationEmail: location1Mock.locationEmail,
            locationIndustry: location1Mock.locationIndustry,
            locationRegion: location1Mock.locationRegion,
            locationCurrency: location1Mock.locationCurrency,
            locationTimeZone: location1Mock.locationTimeZone,
            locationSIUnit: location1Mock.locationSIUnit,
            locationAddressLine1: location1Mock.locationAddressLine1,
            locationAddressLine2: location1Mock.locationAddressLine2,
            locationCity: location1Mock.locationCity,
            locationState: location1Mock.locationState,
            locationCountry: location1Mock.locationCountry,
            locationPostcode: location1Mock.locationPostcode,
            locationApproved: location1Mock.locationApproved,
            __v: 0,
          },
        ],
        totalPages: 2,
        currentPage: 1,
      });
    });

    it("should return the second location if the limit param is set to 1 and page param is set to 2", async () => {
      const location1 = Location.build(location1Mock);
      await location1.save();

      const location2 = Location.build(location2Mock);
      await location2.save();

      const response = await request(app)
        .get(
          `/api/location/v1/email/${location1Mock.locationUserEmail}?limit=1&page=2`
        )
        .set("Authorization", global.signup())
        .expect(200);

      expect(response.body.locations.length).toEqual(1);
      expect(response.body).toEqual({
        locations: [
          {
            _id: location2._id.toString(),
            locationLegalName: location2Mock.locationLegalName,
            locationUserEmail: location2Mock.locationUserEmail,
            locationEmail: location2Mock.locationEmail,
            locationIndustry: location2Mock.locationIndustry,
            locationRegion: location2Mock.locationRegion,
            locationCurrency: location2Mock.locationCurrency,
            locationTimeZone: location2Mock.locationTimeZone,
            locationSIUnit: location2Mock.locationSIUnit,
            locationAddressLine1: location2Mock.locationAddressLine1,
            locationAddressLine2: location2Mock.locationAddressLine2,
            locationCity: location2Mock.locationCity,
            locationState: location2Mock.locationState,
            locationCountry: location2Mock.locationCountry,
            locationPostcode: location2Mock.locationPostcode,
            locationApproved: location2Mock.locationApproved,
            __v: 0,
          },
        ],
        totalPages: 2,
        currentPage: 2,
      });
    });
  });
});
