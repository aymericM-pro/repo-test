import express, { type Express } from "express";
import "reflect-metadata";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { join } from "path";
import request from "supertest";
import { RouterFactory } from "@/router/router.factory";
import { getPrefix } from "@/decorators/http.decorators";
import { AuthController } from "@/modules/auth/infrastructure/http/auth.controller";
import { UserController } from "@/modules/user/infrastructure/http/user.controller";
import { errorHandler } from "@/middlewares/error.middleware";
import { loadHandlers } from "@/mediator/loader";

const ALICE = {
  email: "alice@example.com",
  username: "alice",
  password: "password123",
};

const BOB = {
  email: "bob@example.com",
  username: "bob",
  password: "password123",
};

let app: Express;
let aliceToken: string;
let aliceId: string;

beforeAll(async () => {
  await loadHandlers(join(process.cwd(), "src/modules"));
  app = express();
  app.use(express.json());
  app.use(getPrefix(AuthController), RouterFactory.create(AuthController));
  app.use(getPrefix(UserController), RouterFactory.create(UserController));
  app.use(errorHandler);
});

beforeEach(async () => {
  const res = await request(app).post("/api/auth/register").send(ALICE);

  aliceToken = res.body.token;
  aliceId = res.body.user.id;
});

describe("GET /api/users,", () => {
  it("returns 401 sans token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({ code: "AUTH_MISSING_TOKEN" });
  });

  it("retourne la liste des users", async () => {
    await request(app).post("/api/auth/register").send(BOB);

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("retourne 401 sans token", async () => {
    const res = await request(app).get(`/api/users/${aliceId}`);

    expect(res.status).toBe(401);
  });

  it("retourne le user s'il existe", async () => {
    const res = await request(app)
      .get(`/api/users/${aliceId}`)
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: aliceId,
      email: "alice@example.com",
      username: "alice",
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("retourne 404 si le user n'existe pas", async () => {
    const res = await request(app)
      .get("/api/users/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: "USER_NOT_FOUND" });
  });
});
