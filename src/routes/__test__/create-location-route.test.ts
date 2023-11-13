import request from "supertest";
import { app } from "../../app";
import { Location } from "../../models/Location";
import Redis from "ioredis";
import {
  awsSnsClient,
  awsSqsClient,
  redisClient,
} from "@craftyverse-au/craftyverse-common";

describe("POST /api/location/createLocation", () => {
  let testRedisClient: Redis;

  const mockAwsConfig = {
    credentials: {
      accessKeyId: "aws_access_key_id",
      secretAccessKey: "aws_secret_access_key",
    },
    region: "us-east-1",
    endpoint: "http://localhost:4666",
  };
  const payload = {
    locationName: "Tony",
    locationEmail: "tony.li@test.io",
    locationIndustry: "Crafts",
    locationCurrency: "AUD",
    locationTimeZone: "1691220336946",
    locationSIUnit: "KG",
    locationLegalAddressLine1: "21 George St",
    locationLegalAddressLine2: "Sydney",
    locationLegalCity: "Sydney",
    locationLegalState: "NSW",
    locationLegalCountry: "Australia",
    locationLegalPostcode: "2000",
    locationFirstName: "Tony",
    locationLastName: "Li",
    locationApproved: false,
  };

  beforeEach(() => {
    // This creates a redis client that is connected to the test redis server
    testRedisClient = redisClient.getClient({
      host: "localhost",
      port: 6379,
      password: "password",
    });
  });

  describe("## Route request validation", () => {
    it('should return an error if "locationName" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationName: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationEmail" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationEmail: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationIndustry" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationIndustry: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationCurrency" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationCurrency: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationTimeZone" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationTimeZone: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationSIUnit" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationSIUnit: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalAddressLine1" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalAddressLine1: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalAddressLine2" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalAddressLine2: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalCity" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalCity: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalState" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalState: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalCountry" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalCountry: null });

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalPostcode" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalPostcode: null });

      expect(response.status).toEqual(400);
    });
  });

  describe("## Route response validation", () => {
    it("should successfully listen to /api/location/createLocation for post request", async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .send({});

      expect(response.status).not.toEqual(404);
    });

    it("should successfully save a location into MongoDB if the user is authorised and provides a valid request payload", async () => {
      let locations = await Location.find({});
      expect(locations.length).toEqual(0);

      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload);

      expect(response.status).toEqual(201);

      locations = await Location.find({});

      expect(locations.length).toEqual(1);
    });

    it("should return a status other than a 401 if the user is signed in", async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({});

      expect(response.status).not.toEqual(401);
    });
  });

  describe("## Error response validation", () => {
    it("should return a 401 unauthorised error if the user is unauthorised", async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .send({ ...payload, locationLegalPostcode: null });

      expect(response.status).toEqual(401);
    });
  });

  describe("## Cache implementation", () => {
    it("should populate the cache when a location is created", async () => {
      let locations = await Location.find({});
      expect(locations.length).toEqual(0);

      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload);

      expect(response.status).toEqual(201);

      const cachedLocation = await testRedisClient.get(
        response.body.locationId
      );
      expect(cachedLocation).toEqual(
        `{\"locationId\":\"${response.body.locationId}\",\"locationUserId\":\"${response.body.locationUserId}\",\"locationName\":\"Tony\",\"locationFirstName\":\"Tony\",\"locationLastName\":\"Li\",\"locationEmail\":\"tony.li@test.io\",\"locationIndustry\":\"Crafts\",\"locationCurrency\":\"AUD\",\"locationTimeZone\":\"1691220336946\",\"locationSIUnit\":\"KG\",\"locationLegalAddressLine1\":\"21 George St\",\"locationLegalAddressLine2\":\"Sydney\",\"locationLegalCity\":\"Sydney\",\"locationLegalState\":\"NSW\",\"locationLegalCountry\":\"Australia\",\"locationLegalPostcode\":\"2000\",\"locationApproved\":false}`
      );
    });
  });

  describe("## Event publishing validation", () => {
    it('should create a new SNS topic called "location_created" if it does not exist', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload);

      expect(response.status).toEqual(201);

      const topicList = await awsSnsClient.listAllSnsTopics(mockAwsConfig);
      const topicArn = topicList.Topics![0].TopicArn;
      expect(topicArn).toEqual(
        "arn:aws:sns:us-east-1:000000000000:location_created"
      );
    });

    it('should publish a message to the "location_created" topic when a location is created', async () => {
      const publishSnsMessageSpy = jest.spyOn(
        awsSnsClient,
        "publishSnsMessage"
      );
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload);

      expect(response.status).toEqual(201);
      expect(publishSnsMessageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
