import request from "supertest";
import { app } from "../../../app";
import { Location } from "../../../model/location";

describe("## DELETE /api/location/v1//:locationId", () => {
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

  describe("## Request parameter validation", () => {
    it("should return a (400) BadRequestError if the locationId is not provided", async () => {
      const response = await request(app).delete(`/api/location/v1/${undefined}`).set("Authorization", global.signup());
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [{ message: "Location ID is required.", field: "badRequest" }],
      });
    });
  });

  describe("## Endpoint validation", () => {
    it("should successfully delete a location from");
  });
});
