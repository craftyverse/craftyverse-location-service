import request from 'supertest';
import { app } from '../../app';

describe('GET /api/location/getLocation', () => {
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
  };

  describe('## Response validation', () => {
    it('should return a 404 status if the location is not found', async () => {
      await request(app).get('/api/location/asdfgeearg').send().expect(404);
    });

    it('should return the ticket if the location is found', async () => {
      const createLocationResponse = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send(payload)
        .expect(201);

      await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set('Cookie', global.signup())
        .send()
        .expect(200);
    });

    it('should only return the fields that are specified in the query param array', async () => {
      const createLocationResponse = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}?fields=locationId,locationTimeZone`
        )
        .set('Cookie', global.signup())
        .send()
        .expect(200);

      const getLocationResponseBody = getLocationResponse.body;
      expect(getLocationResponseBody.locationTimeZone).toEqual(
        payload.locationTimeZone
      );
    });

    it('should return the full object if there is no query parameters defined', async () => {
      const createLocationResponse = await request(app)
        .post('/api/location/createLocation')
        .set('Cookie', global.signup())
        .send(payload)
        .expect(201);

      const getLocationResponse = await request(app)
        .get(
          `/api/location/getLocation/${createLocationResponse.body.locationId}`
        )
        .set('Cookie', global.signup())
        .send()
        .expect(200);

      expect(getLocationResponse.body).toEqual({
        _id: createLocationResponse.body.locationId,
        locationUserId: '001',
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
        __v: 0,
      });
    });
  });
});
