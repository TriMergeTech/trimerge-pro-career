import request from 'supertest';
import express from 'express';

describe('Health endpoint', () => {
  it('returns API health status', async () => {
    const app = express();

    app.get('/health', (_req, res) => {
      res.json({ status: 'ok', service: 'api' });
    });

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'api',
    });
  });
});