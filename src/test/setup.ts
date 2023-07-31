import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
  var signup: () => Promise<string[]>;
}

let mongoDb: any;
let mongoDbUri: any;

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

global.signup = async () => {
  const userFirstName = 'Tony';
  const userLastName = 'Li';
  const userEmail = 'tony.li@test.io';
  const userPassword = 'Password123!';
  const userConfirmPassword = 'Password123!';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      userFirstName,
      userLastName,
      userEmail,
      userPassword,
      userConfirmPassword,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
