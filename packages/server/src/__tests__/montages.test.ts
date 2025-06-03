import setupApp from '../index';

describe('Montages API', () => {
  let app: any;
  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /api/montages should return list of montages', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/montages' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'List of montages');
  });

  it('GET /api/montages/:id should return montage details', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/montages/456' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', '456');
    expect(res.json()).toHaveProperty('message', 'Montage details');
  });

  it('POST /api/montages should create a new montage', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/montages', payload: { foo: 'bar' } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'Montage created');
  });

  it('DELETE /api/montages/:id should delete a montage', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/montages/456' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', '456');
    expect(res.json()).toHaveProperty('message', 'Montage deleted');
  });
});
