import setupApp from '../index';

import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Queue API', () => {

  let app: any;
  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should add an item to the queue', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/queue',
      payload: { payload: { foo: 'bar' } }
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.message).toBe('Added to queue');
    expect(body.item).toHaveProperty('id');
  });

  it('should get the current queue', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/queue',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('queue');
    expect(Array.isArray(body.queue)).toBe(true);
  });
});
