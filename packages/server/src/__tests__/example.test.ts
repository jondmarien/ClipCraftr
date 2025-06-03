import setupApp from '../index';

describe('Example test', () => {

  let app: any;
  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });
});


