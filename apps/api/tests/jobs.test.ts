import request from 'supertest';
import app from '../src/app';
import { signTestToken } from './helpers/token';

describe('Job routes', () => {
  it('returns 401 for POST /api/v1/jobs without token', async () => {
    const response = await request(app).post('/api/v1/jobs').send({});

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 403 for POST /api/v1/jobs with TALENT token', async () => {
    const token = signTestToken({
      userId: 'talent-id',
      email: 'talent@test.com',
      accountType: 'TALENT',
    });

    const response = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});