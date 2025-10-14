import request from 'supertest';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8081';
const VERIFY_PATH = '/verify';

const validId = process.env.TEST_CREDENTIAL_ID_VALID;
const invalidId = process.env.TEST_CREDENTIAL_ID_INVALID || `non-existent-${Date.now()}`;

const maybe = (cond) => (cond ? test : test.skip);

describe('Verification service (running server)', () => {
  // Increase timeout for slow environments
  beforeAll(() => {
    // @ts-ignore - available in Jest
    if (typeof jest !== 'undefined' && jest.setTimeout) jest.setTimeout(30000);
  });

  it('POST verify returns 4xx when body is missing/invalid', async () => {
    const res = await request(BASE)
      .post(VERIFY_PATH)
      .set('Content-Type', 'application/json')
      .send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('POST verify returns 404 for unknown credentialId', async () => {
    const res = await request(BASE)
      .post(VERIFY_PATH)
      .set('Content-Type', 'application/json')
      .send({ credentialId: invalidId });
    expect([404, 400]).toContain(res.status);
    if (res.status === 404) {
      expect(res.body).toMatchObject({ success: false });
    }
  });

  // Run this only if you provide a real, existing credentialId
  maybe(!!validId)('POST verify returns 200 for a valid credentialId', async () => {
    const res = await request(BASE)
      .post(VERIFY_PATH)
      .set('Content-Type', 'application/json')
      .send({ credentialId: validId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('result');

    const result = res.body.result;
    expect(result).toHaveProperty('credentialId', validId);
    expect(result).toHaveProperty('credential');
    expect(result).toHaveProperty('workerId');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('created');
  });
});

