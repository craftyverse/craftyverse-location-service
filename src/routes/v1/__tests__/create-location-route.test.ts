import request from "supertest";
import { app } from "../../../app";
import { Location } from "../../../model/location";
import { awsConfigUtils } from "../../../../config/aws-config";

describe("## POST /api/locations/v1/locations", () => {
  const locationMock = {
    locationLegalName: "Crafftyverse",
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
    it("should return a 400 (RequestValidationError) if locationLegalName is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationLegalName: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationLegalName" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationEmail is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationEmail: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationEmail" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationIndustry is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationIndustry: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationIndustry" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationRegion is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationRegion: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationRegion" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationCurrency is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationCurrency: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationCurrency" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationTimeZone is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationTimeZone: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationTimeZone" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationSIUnit is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationSIUnit: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationSIUnit" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationAddressLine1 is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationAddressLine1: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationAddressLine1" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationAddressLine2 is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationAddressLine2: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationAddressLine2" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationCity is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationCity: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationCity" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationState is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationState: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationState" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationCountry is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationCountry: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationCountry" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationPostcode is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationPostcode: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationPostcode" }],
      });
    });

    it("should return a 400 (RequestValidationError) if locationApproved is not provided", async () => {
      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send({
          ...locationMock,
          locationApproved: undefined,
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [{ message: "Required", field: "locationApproved" }],
      });
    });
  });

  describe("## database retrieval validation", () => {
    it("should return a 409 (ConflictError) if location already exists", async () => {
      const newLocation = Location.build({
        ...locationMock,
        locationUserEmail: "example@example.com",
      });
      await newLocation.save();

      const response = await request(app)
        .post("/api/location/v1/createLocation")
        .set("Authorization", global.signup())
        .send(locationMock)
        .expect(409);

      expect(response.body).toEqual({
        errors: [{ field: "Conflict", message: "Location already exists." }],
      });
    });

    it("should return a 201 (Created) if location does not exist", async () => {
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
    });
  });

  describe("## SNS validation", () => {
    it("should return a 201 (Created) if location does not exist", async () => {
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
    });
  });
});
