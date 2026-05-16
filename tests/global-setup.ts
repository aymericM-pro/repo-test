import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

let container: StartedPostgreSqlContainer | null = null;

const LOCAL_CONN = {
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 5432),
  user:     process.env.DB_USER     ?? 'todo_user',
  password: process.env.DB_PASSWORD ?? 'todo_pass',
  database: process.env.DB_NAME     ?? 'todo_test',
};

export async function setup() {
  let conn = LOCAL_CONN;

  try {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('todo_test')
      .withUsername('todo_user')
      .withPassword('todo_pass')
      .start();

    conn = {
      host:     container.getHost(),
      port:     container.getMappedPort(5432),
      user:     container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
    };
    console.log('[test] Using testcontainers PostgreSQL');
  } catch {
    console.warn(`[test] Docker unavailable – falling back to local PostgreSQL at ${conn.host}:${conn.port}`);
  }

  process.env.DB_HOST     = conn.host;
  process.env.DB_PORT     = String(conn.port);
  process.env.DB_USER     = conn.user;
  process.env.DB_PASSWORD = conn.password;
  process.env.DB_NAME     = conn.database;
  process.env.NODE_ENV    = 'test';
  process.env.JWT_SECRET  = 'test-secret';

  const client = new Client(conn);
  await client.connect();
  await client.query(readFileSync(join(process.cwd(), 'sql/schema.sql'), 'utf8'));
  await client.end();
}

export async function teardown() {
  await container?.stop();
}
