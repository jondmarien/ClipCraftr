import setupApp from '../index';

describe('Clips API', () => {
  let app: any;
  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /api/clips should return list of clips', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/clips' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'List of clips');
  });

  it('GET /api/clips/:id should return clip details', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/clips/123' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', '123');
    expect(res.json()).toHaveProperty('message', 'Clip details');
  });

  it('POST /api/clips should upload a new clip', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/clips', payload: { foo: 'bar' } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'Clip uploaded');
  });

  it('DELETE /api/clips/:id should delete a clip', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/clips/123' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', '123');
    expect(res.json()).toHaveProperty('message', 'Clip deleted');
  });
});
