import request from 'supertest';
import { app } from '../index.js'; 
import { closeDatabase } from '../db/db.js'; 
import { jest } from '@jest/globals';

jest.mock('../db/db', () => ({
    getCredential: jest.fn(),
    saveCredential: jest.fn(),
    closeDatabase: jest.fn()
}));

describe('Issuance API', () => {
  
  afterAll(async () => {
    await closeDatabase();
  });
  
  it('should issue new credential', async () => {
    const res = await request(app)
      .post('/gen')
      .send({ credential: 'cred1', name: 'Alice' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true); 
    expect(res.body.message).toContain('Credential issued successfully'); 
  });
  
  it('should reject credential without required fields', async () => {
    const res = await request(app)
      .post('/gen')
      .send({ name: 'Alice' }); 
    
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
  
  it('should indicate when credential is already issued', async () => {
    await request(app)
      .post('/gen')
      .send({ credential: 'cred2', name: 'Bob' });
    
    const res = await request(app)
      .post('/gen')
      .send({ credential: 'cred2', name: 'Bob' });
    
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already issued');
  });
});
