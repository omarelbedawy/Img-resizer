import request from 'supertest';
import app from '../../../index';

describe('Test /api/images route', () => {
  it('should return 200 status code if code is successful', async () => {
    const response = await request(app).get('/api/images');
    expect(response.statusCode).toBe(200);
  });
});
