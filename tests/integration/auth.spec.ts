import 'reflect-metadata';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { join } from 'path';
import express, { type Express } from 'express';
import request from 'supertest';
import { RouterFactory } from '@/router/router.factory';
import { getPrefix } from '@/decorators/http.decorators';
import { AuthController } from '@/modules/auth/infrastructure/http/auth.controller';
import { errorHandler } from '@/middlewares/error.middleware';
import { loadHandlers } from '@/mediator/loader';

const VALID_REGISTER_BODY = {
  email:    'alice@example.com',
  username: 'alice',
  password: 'password123',
};

const VALID_LOGIN_BODY = {
  email:    'alice@example.com',
  password: 'password123',
};

let app: Express;

beforeAll(async () => {
  await loadHandlers(join(process.cwd(), 'src/modules'));
  app = express();
  app.use(express.json());
  app.use(getPrefix(AuthController), RouterFactory.create(AuthController));
  app.use(errorHandler);
});

describe('POST /api/auth/register', () => {
  it('crée un utilisateur et retourne 200 + token', async () => {
    const res = await request(app).post('/api/auth/register').send(VALID_REGISTER_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      token: expect.any(String),
      user:  { email: 'alice@example.com', username: 'alice' },
    });
  });

  it('retourne 409 si l\'email est déjà utilisé', async () => {
    await request(app).post('/api/auth/register').send(VALID_REGISTER_BODY);
    const res = await request(app).post('/api/auth/register').send(VALID_REGISTER_BODY);

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ code: 'USER_ALREADY_EXISTS' });
  });

  it('retourne 400 si les champs requis manquent', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'alice@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('retourne 400 si le mot de passe est trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER_BODY, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_REGISTER_BODY);
  });

  it('retourne 200 + token avec des identifiants valides', async () => {
    const res = await request(app).post('/api/auth/login').send(VALID_LOGIN_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      token: expect.any(String),
      user:  { email: 'alice@example.com' },
    });
  });

  it('retourne 401 avec un mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...VALID_LOGIN_BODY, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'USER_INVALID_CREDENTIALS' });
  });

  it('retourne 401 avec un email inconnu', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'USER_INVALID_CREDENTIALS' });
  });

  it('retourne 400 si le champ email manque', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
