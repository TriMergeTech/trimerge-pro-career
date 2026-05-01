import request from 'supertest';
import app from '../src/app';
import { signTestToken } from './helpers/token';

describe('Application routes', () => {
  it('returns 401 for GET /api/v1/applications/my-applications without token', async () => {
    const response = await request(app).get('/api/v1/applications/my-applications?page=1&limit=10');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 403 for GET /api/v1/applications/my-applications with EMPLOYER token', async () => {
    const token = signTestToken({
      userId: 'employer-id',
      email: 'employer@test.com',
      accountType: 'EMPLOYER',
    });

    const response = await request(app)
      .get('/api/v1/applications/my-applications?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });

  it('returns 403 for GET /api/v1/applications/job/:jobId with TALENT token', async () => {
    const token = signTestToken({
      userId: 'talent-id',
      email: 'talent@test.com',
      accountType: 'TALENT',
    });

    const response = await request(app)
      .get('/api/v1/applications/job/job-id-123?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});