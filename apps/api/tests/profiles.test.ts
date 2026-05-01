import request from 'supertest';
import app from '../src/app';
import { signTestToken } from './helpers/token';

describe('Profile routes', () => {
  it('returns 401 for GET /api/v1/candidates/me without token', async () => {
    const response = await request(app).get('/api/v1/candidates/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 401 for GET /api/v1/employers/me without token', async () => {
    const response = await request(app).get('/api/v1/employers/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 403 for GET /api/v1/employers/me with TALENT token', async () => {
    const token = signTestToken({
      userId: 'talent-id',
      email: 'talent@test.com',
      accountType: 'TALENT',
    });

    const response = await request(app)
      .get('/api/v1/employers/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });

  it('returns 403 for GET /api/v1/candidates/me with EMPLOYER token', async () => {
    const token = signTestToken({
      userId: 'employer-id',
      email: 'employer@test.com',
      accountType: 'EMPLOYER',
    });

    const response = await request(app)
      .get('/api/v1/candidates/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});