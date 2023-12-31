import request from "supertest";
import { app } from "../../app";
import { Location } from "../../models/Location";
import redisClient from "../../services/redis-service";
import Redis from "ioredis";
import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import { awsSqsClient } from "@craftyverse-au/craftyverse-common";

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

    it('should return an error if "locationLegalBusinessName" mandatory field is not included in the request', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send({ ...payload, locationLegalBusinessName: null });

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
        `{\"locationId\":\"${response.body.locationId}\",\"locationUserId\":\"${response.body.locationUserId}\",\"locationName\":\"Tony\",\"locationEmail\":\"tony.li@test.io\",\"locationIndustry\":\"Crafts\",\"locationRegion\":\"AUS\",\"locationCurrency\":\"AUD\",\"locationTimeZone\":\"1691220336946\",\"locationSIUnit\":\"KG\",\"locationLegalBusinessName\":\"Craftyverse\",\"locationLegalAddressLine1\":\"21 George St\",\"locationLegalAddressLine2\":\"Sydney\",\"locationLegalCity\":\"Sydney\",\"locationLegalState\":\"NSW\",\"locationLegalCountry\":\"Australia\",\"locationLegalPostcode\":\"2000\",\"locationApproved\":false}`
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

    it('should create a new SQS queue called "location_created_queue" if it does not exist', async () => {
      const response = await request(app)
        .post("/api/location/createLocation")
        .set("Cookie", global.signup())
        .send(payload);

      expect(response.status).toEqual(201);

      const queueList = await awsSqsClient.listAllSqsQueues(mockAwsConfig, {
        queueNamePrefix: "location_created_queue",
        maxResults: 1,
      });
      console.log("This is the queue list: ", queueList);
      const queueUrl = queueList.QueueUrls![0];
      expect(queueUrl).toEqual(
        "http://localhost:4666/000000000000/location_created_queue"
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
