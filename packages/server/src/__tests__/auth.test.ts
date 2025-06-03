import setupApp from '../index';

describe('Auth API', () => {
  let app: any;
  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /api/auth/login should login', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { user: 'test', pass: 'test' } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'Login successful');
  });

  it('POST /api/auth/logout should logout', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/logout' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message', 'Logout successful');
  });

  it('GET /api/auth/me should return current user', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/me' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('user');
    expect(res.json().user).toHaveProperty('id');
    expect(res.json().user).toHaveProperty('username');
  });
});
