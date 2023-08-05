import request from 'supertest';
import { app } from '../../app';

describe('POST /api/location/createLocation', () => {
  const payload = {
    locationName: 'Tony',
    locationEmail: 'tony.li@test.io',
    locationIndustry: 'Crafts',
    locationRegion: 'AUS',
    locationCurrency: 'AUD',
    locationTimeZone: '1691220336946',
    locationSIUnit: 'KG',
    locationLegalBusinessName: 'Craftyverse',
    locationLegalAddressLine1: '21 George St',
    locationLegalAddressLine2: 'Sydney',
    locationLegalCity: 'Sydney',
    locationLegalState: 'NSW',
    locationLegalCountry: 'Australia',
    locationLegalPostcode: '2000',
  }
  describe('## Route request validation', () => {
    it('should return an error if "locationName" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationName: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationEmail" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationEmail: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationIndustry" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationIndustry: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationCurrency" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationCurrency: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationTimeZone" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationTimeZone: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationSIUnit" mandatory field is null in the request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationSIUnit: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalBusinessName" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalBusinessName: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalAddressLine1" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalAddressLine1: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalAddressLine2" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalAddressLine2: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalCity" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalCity: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalState" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalState: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalCountry" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalCountry: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });

    it('should return an error if "locationLegalPostcode" mandatory field is not included in the request', async () => { 
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({ ...payload, locationLegalPostcode: null });

      console.log(response.body)

      expect(response.status).toEqual(400);
    });
  });

  describe('## Route response validation', () => {
    it('should successfully listen to /api/location/createLocation for post request', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .send({});

      expect(response.status).not.toEqual(404);
    });

    it('should successfully accessed if the user is authorised and provides a valid request payload', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send(payload);

      expect(response.status).toEqual(201);
    });

    it('should return a status other than a 401 if the user is signed in', async () => {
      const response = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send({});

      console.log(response.status);

      expect(response.status).not.toEqual(401);
    });
  });

  describe('## Error response validation', () => {
    it('should return a 401 unauthorised error if the user is unauthorised', async () => { });

    it('should return a 400 bad request error if a reuqest has failed', async () => { });
  });

  describe('## Cache implementation', () => {
    it('should populate the cache when a location is created', async () => { });
  });
});
