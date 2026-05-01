import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { env } from '../src/config/env';

describe('Admin routes', () => {
  it('returns 401 for GET /api/v1/admin/users without token', async () => {
    const response = await request(app).get('/api/v1/admin/users?page=1&limit=10');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 403 for GET /api/v1/admin/users with non-admin token', async () => {
    const token = jwt.sign(
      {
        userId: 'test-user-id',
        email: 'candidate@test.com',
        accountType: 'TALENT',
      },
      env.JWT_ACCESS_SECRET as jwt.Secret,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      }
    );

    const response = await request(app)
      .get('/api/v1/admin/users?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});