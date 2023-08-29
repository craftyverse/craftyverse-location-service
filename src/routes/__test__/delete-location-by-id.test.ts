import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("DELETE /api/location/deleteLocationById/:id", () => {
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
    });
  });
});
