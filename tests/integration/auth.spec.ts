import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { RouterFactory } from '@/router/router.factory';
import { getPrefix } from '@/decorators/http.decorators';
import { AuthController } from '@/modules/auth/infrastructure/http/auth.controller';
import { errorHandler } from '@/middlewares/error.middleware';
import { AppError } from '@/errors/app-error';

vi.mock('@/mediator/mediator', () => ({
  mediator: { send: vi.fn() },
}));

import { mediator } from '@/mediator/mediator';
const mockSend = vi.mocked(mediator.send);

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(getPrefix(AuthController), RouterFactory.create(AuthController));
  app.use(errorHandler);
  return app;
}

const VALID_REGISTER_BODY = {
  email: 'alice@example.com',
  username: 'alice',
  password: 'password123',
};

const VALID_LOGIN_BODY = {
  email: 'alice@example.com',
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('returns 200 and the auth response when the body is valid', async () => {
    const authResponse = { token: 'jwt-token', user: { id: 'u1', email: 'alice@example.com', username: 'alice' } };
    mockSend.mockResolvedValue(authResponse);

    const res = await request(buildApp())
      .post('/api/auth/register')
      .send(VALID_REGISTER_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(authResponse);
    expect(mockSend).toHaveBeenCalledOnce();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(buildApp())
      .post('/api/auth/register')
      .send({ email: 'alice@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(buildApp())
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER_BODY, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('returns 200 and the auth response when credentials are valid', async () => {
    const authResponse = { token: 'jwt-token', user: { id: 'u1', email: 'alice@example.com', username: 'alice' } };
    mockSend.mockResolvedValue(authResponse);

    const res = await request(buildApp())
      .post('/api/auth/login')
      .send(VALID_LOGIN_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(authResponse);
  });

  it('returns 401 when mediator throws an auth AppError', async () => {
    mockSend.mockRejectedValue(new AppError('USER_INVALID_CREDENTIALS', 401, 'Invalid email or password'));

    const res = await request(buildApp())
      .post('/api/auth/login')
      .send(VALID_LOGIN_BODY);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'USER_INVALID_CREDENTIALS' });
  });

  it('returns 400 when the email field is missing', async () => {
    const res = await request(buildApp())
      .post('/api/auth/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(mockSend).not.toHaveBeenCalled();
  });
});
