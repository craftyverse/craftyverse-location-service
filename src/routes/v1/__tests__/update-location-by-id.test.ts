import request from "supertest";
import { app } from "../../../app";
import { Location } from "../../../model/location";
import { awsConfigUtils } from "../../../../config/aws-config";
import mongoose from "mongoose";

describe("## PATCH /api/location/v1/:locationId", () => {
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
    locationApprovedAt: null,
    locationCreatedAt: new Date().toISOString(),
    locationDeletedAt: null,
  };

  describe("# Request validation", () => {
    it("should return a 400 (RequestValidationError) if there is no request body", async () => {
      await request(app)
        .patch("/api/location/v1/123456789")
        .set("Authorization", global.signup())
        .send({})
        .expect(400);
    });

    it("should return a 403 (NotAuthorizedError) if the user is not authenticated", async () => {
      await request(app)
        .patch("/api/location/v1/123456789")
        .send({})
        .expect(401);
    });

    it("should return a 500 (BadRequestError) if the locationId is not provided", async () => {
      await request(app)
        .patch(`/api/location/v1/${undefined}`)
        .set("Authorization", global.signup())
        .send({})
        .expect(400);
    });
  });

  describe("# Data update validation", () => {
    const currentDate = new Date().toISOString();

    beforeEach(async () => {
      jest.spyOn(awsConfigUtils, "getTopicArns").mockReturnValue(
        Promise.resolve({
          "location-created":
            "arn:aws:sns:ap-southeast-2:000000000000:location-created",
          "location-updated":
            "arn:aws:sns:ap-southeast-2:000000000000:location-updated",
        })
      );
    });
    it("should return a 400 (BadRequestErorr) if the location does not exist", async () => {
      const mockLocationId = new mongoose.Types.ObjectId().toHexString();
      const response = await request(app)
        .patch(`/api/location/v1/${mockLocationId}`)
        .set("Authorization", global.signup())
        .send({
          locationLegalName: "Crafftyverse",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            message: "Location did not update successfully.",
            field: "badRequest",
          },
        ],
      });
    });

    it('should successfully update a location with the "locationLegalName" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationLegalName: "Love Craft Studios",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationLegalName).toEqual(
        "Love Craft Studios"
      );
    });

    it('should successfully update a location with the "locationEmail" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationEmail: "mark.liu@test.io",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationEmail).toEqual(
        "mark.liu@test.io"
      );
    });
    it('should successfully update a location with the "locationIndustry" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationIndustry: "Technology",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);
    });

    it('should successfully update a location with the "locationRegion" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationRegion: "USA",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);
    });

    it('should successfully update a location with the "locationCurrency" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationCurrency: "CNY",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationCurrency).toEqual("CNY");
    });

    it('should successfully update a location with the "locationTimeZone" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationTimeZone: "GST",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationTimeZone).toEqual("GST");
    });

    it('should successfully update a location with the "locationRegion" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationSIUnit: "LBS",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationSIUnit).toEqual("LBS");
    });

    it('should successfully update a location with the "locationAddressLine1" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationAddressLine1: "24 Delaney Drive",
        })
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .set("Authorization", global.signup())
        .send({
          locationAddressLine1: "25 Delaney Drive",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .expect(200);

      expect(updateLocationResponse.body.locationAddressLine1).toEqual(
        "25 Delaney Drive"
      );
    });

    it('should successfully update a location with the "locationAddressLine2" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationAddressLine2: "Baulkham Hills",
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationAddressLine2: "Castle Hill",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationAddressLine2).toEqual(
        "Castle Hill"
      );
    });

    it('should successfully update a location with the "locationCity" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationCity: "Sydney",
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationCity: "Melbourne",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationCity).toEqual("Melbourne");
    });

    it('should successfully update a location with the "locationState" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationState: "NSW",
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationState: "VIC",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationState).toEqual("VIC");
    });

    it('should successfully update a location with the "locationCountry" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationCountry: "Australia",
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationCountry: "China",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationCountry).toEqual("China");
    });

    it('should successfully update a location with the "locationPostcode" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationPostcode: "2153",
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationPostcode: "2155",
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationPostcode).toEqual("2155");
    });

    it('should successfully update a location with the "locationApproved" field', async () => {
      const createLocationResponse = await request(app)
        .post("/api/location/v1/createLocation")
        .send({
          ...locationMock,
          locationApproved: false,
        })
        .set("Authorization", global.signup())
        .expect(201);

      const updateLocationResponse = await request(app)
        .patch(`/api/location/v1/${createLocationResponse.body._id}`)
        .send({
          locationApproved: true,
          locationApprovedAt: null,
          locationCreatedAt: currentDate,
          locationDeletedAt: null,
        })
        .set("Authorization", global.signup())
        .expect(200);

      expect(updateLocationResponse.body.locationApproved).toEqual(true);
    });
  });
});
