import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis-mock';

declare global {
  var signup: () => string[];
}

let mongoDb: any;
let mongoDbUri: any;
let redis: any;

// Before all test suite, create a mock mongodb connection along with
// a connection string
beforeAll(async () => {
  process.env.JWT_KEY = 'asfoijea';
  mongoDb = await MongoMemoryServer.create();
  mongoDbUri = mongoDb.getUri();
  await mongoose.connect(mongoDbUri, {});
});

// Before each test, clear existing mongodb collections
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.map(async (collection) => {
    await collection.deleteMany({});
  });
});

// Close conenction after test suite
afterAll(async () => {
  await mongoDb.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  const payload = {
    id: '1234',
    firstName: 'Tony',
    lastName: 'Li',
    email: 'tony.li@test.io',
    iat: 1691057607798,
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY);

  // Build a Session object
  const session = { jwt: token };

  // Turn this into JSON object
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
