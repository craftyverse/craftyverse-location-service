import request from 'supertest';
import { app } from '../../app';

describe('GET /api/location/getLocationByEmail/:email', () => {
  describe('## Response validation', () => {
    it('should return a 404 status if the location is not found', async () => {
      const getLocationByEmailResponse = await request(app)
        .get('/api/location/getLocationByEmail/asdfgeearg')
        .set('Cookie', global.signup())
        .send()
        .expect(404);

      console.log(getLocationByEmailResponse.body);
    });
  });
});
