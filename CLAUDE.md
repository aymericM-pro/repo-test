# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (nodemon + ts-node)
pnpm build        # tsc && tsc-alias (compiles to dist/)
pnpm test         # run all tests
pnpm test:unit    # tests/unit only
pnpm test:integration  # tests/integration only
pnpm test:coverage

# Run a single test file
npx vitest run tests/unit/game.spec.ts

# Type-check without emitting
npx tsc --noEmit

# Apply DB schema
psql -h localhost -U todo_user -d todo_db -f sql/schema.sql
```

## Architecture

Custom-built framework — no NestJS, no Inversify. Everything is hand-rolled.

### Request lifecycle

```
HTTP → Express router (RouterFactory)
     → Controller method (decorators: @Get, @Post, @Param, @CurrentUser, @ValidatedBody)
     → mediator.send(new XxxCommand/Query(...))
     → @Handler decorator auto-registers handler at import time
     → handler.handle(cmd) → domain entity → repository → response DTO
```

### CQRS / Mediator

- `src/mediator/` — `IRequest<TResponse>`, `IHandler`, `mediator.send()`, `@Handler` decorator
- The `@Handler(XxxCommand)` class decorator **auto-registers** the handler into the mediator at module load time. No explicit registration needed.
- `loadHandlers(dir)` in `app.ts` does a recursive glob for `*.handler.ts` files and imports them all — this triggers the decorators.
- **Every `IRequest` subclass must declare `declare readonly _responseType: T`** (phantom field for TypeScript inference, zero runtime cost).

### Dependency injection

Manual symbol-based DI via `src/container.ts`. All repository and service bindings live there. Handlers receive deps via constructor (optional params with fallback to `container.resolve(SYMBOL)`).

### Module structure

Each module under `src/modules/<name>/` follows clean architecture:
```
domain/
  <name>.entity.ts       # business logic, no framework deps
  <name>.errors.ts       # AppError factories with HTTP status codes
  ports/<name>.repository.port.ts  # interface + Symbol token
application/
  commands/              # write operations: XxxCommand + XxxHandler
  queries/               # read operations: XxxQuery + XxxHandler
  dtos/                  # request/response DTOs (class-validator on request)
  mappers/               # Entity ↔ DTO ↔ ORM three-way mapper
infrastructure/
  http/<name>.controller.ts
  persistence/<name>.orm-entity.ts   # TypeORM entity
  persistence/<name>.repository.adapter.ts
```

Modules: `auth`, `games`, `user`.

### Auth

- `POST /api/auth/register` and `POST /api/auth/login` are public (no middleware).
- All other routes require `@UseMiddleware(authenticate)` on the controller class.
- JWT is signed/verified with `process.env.JWT_SECRET` (defaults to `"secret"`).
- DI ports: `HASH_SERVICE` (bcrypt) and `TOKEN_SERVICE` (jsonwebtoken) in `src/modules/auth/`.

### Path aliases

`@/` maps to `src/`. Resolved at runtime via `tsconfig-paths` (dev) and `tsc-alias` (build). Never use relative `../` imports.

### Database

PostgreSQL via TypeORM with `synchronize: false`. Schema is in `sql/schema.sql`. All ORM entities must be added to the `entities` array in `src/data-source.ts`.

### Logging

Structured logging via `pino`. The root logger is exported from `src/container.ts` as `logger` and also registered under `LOGGER` symbol for DI.

- **Dev**: `pino-pretty` (colorized, human-readable)
- **Prod**: JSON to stdout + daily rotating file via `pino-roll` in `logs/`
- **Level**: controlled by `LOG_LEVEL` env var (defaults to `debug` in dev, `info` in prod)

Every HTTP request gets a `requestId` (from `x-request-id` header or generated) attached to `req.requestId` and `req.log` (child logger with requestId bound). Log levels for responses: `info` (2xx), `warn` (4xx), `error` (5xx).

```typescript
// In any handler (inject via constructor or container):
const log = container.resolve<ILogger>(LOGGER);
log.info('game created', { gameId });
log.error('failed to save', err, { gameId });
```

### PDF generation

`pdfService.generate(type, payload)` uses Puppeteer. Types and payloads are defined in `src/pdf/pdf.types.ts`. Templates are HTML strings built in `src/pdf/templates/`. Controllers return `{ __type: "file", buffer, filename, contentType }` to stream PDFs.

### Testing patterns

- Unit tests: inject mock repository directly into handler constructor (bypasses `container.resolve`).
- Integration tests: mock `auth.middleware` to inject a fixed `userId`, mock `mediator.send` with `vi.fn()`, spin up an Express app with `RouterFactory`.
- `vitest.config.ts` has the `@/` alias configured.
