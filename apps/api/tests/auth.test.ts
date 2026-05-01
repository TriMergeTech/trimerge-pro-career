import request from 'supertest';
import app from '../src/app';

describe('Auth routes', () => {
  it('returns 401 for GET /api/v1/auth/me without token', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});