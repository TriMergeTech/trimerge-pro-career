import request from 'supertest';
import app from '../src/app';
import { signTestToken } from './helpers/token';

describe('Onboarding RBAC routes', () => {
  it('returns 403 for POST /api/v1/onboarding/recruiter/step-2 with TALENT token', async () => {
    const token = signTestToken({
      userId: 'talent-id',
      email: 'talent@test.com',
      accountType: 'TALENT',
    });

    const response = await request(app)
      .post('/api/v1/onboarding/recruiter/step-2')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });

  it('returns 403 for POST /api/v1/onboarding/candidate/step-2 with EMPLOYER token', async () => {
    const token = signTestToken({
      userId: 'employer-id',
      email: 'employer@test.com',
      accountType: 'EMPLOYER',
    });

    const response = await request(app)
      .post('/api/v1/onboarding/candidate/step-2')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});