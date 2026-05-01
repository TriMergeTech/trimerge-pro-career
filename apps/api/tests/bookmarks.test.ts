import request from 'supertest';
import app from '../src/app';
import { signTestToken } from './helpers/token';

describe('Bookmark routes', () => {
  it('returns 401 for GET /api/v1/bookmarks/my-bookmarks without token', async () => {
    const response = await request(app).get('/api/v1/bookmarks/my-bookmarks?page=1&limit=10');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 403 for GET /api/v1/bookmarks/my-bookmarks with EMPLOYER token', async () => {
    const token = signTestToken({
      userId: 'employer-id',
      email: 'employer@test.com',
      accountType: 'EMPLOYER',
    });

    const response = await request(app)
      .get('/api/v1/bookmarks/my-bookmarks?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
});