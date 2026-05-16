import 'reflect-metadata';
import { AppDataSource } from '@/data-source';
import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

afterEach(async () => {
  await AppDataSource.query('TRUNCATE TABLE parties, games, players, users CASCADE');
});
