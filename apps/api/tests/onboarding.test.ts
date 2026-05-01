import request from 'supertest';
import app from '../src/app';

describe('Onboarding routes', () => {
  it('returns 401 for GET /api/v1/onboarding/status without token', async () => {
    const response = await request(app).get('/api/v1/onboarding/status');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});