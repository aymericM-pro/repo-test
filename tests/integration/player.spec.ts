import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { loadHandlers } from "@/mediator/loader";
import { join } from "path";
import express, { Express } from "express";
import { getPrefix } from "@/decorators/http.decorators";
import { RouterFactory } from "@/router/router.factory";
import { errorHandler } from "@/middlewares/error.middleware";
import request from "supertest";
import { AuthController } from "@/modules/auth/infrastructure/http/auth.controller";
import { PlayerController } from "@/modules/player/infrastructure/http/player.controller";

const ALICE = {
    email: "alice@example.com",
    username: "alice",
    password: "password123",
};

let app: Express;
let aliceToken: string;

beforeAll(async () => {
    await loadHandlers(join(process.cwd(), "src/modules"));
    app = express();
    app.use(express.json());
    app.use(getPrefix(AuthController), RouterFactory.create(AuthController));
    app.use(getPrefix(PlayerController), RouterFactory.create(PlayerController));
    app.use(errorHandler);
});

beforeEach(async () => {
    const aliceRes = await request(app).post("/api/auth/register").send(ALICE);
    aliceToken = aliceRes.body.token;
});

describe("POST /api/players", () => {
    it("crée un player et retourne 200", async () => {
        const res = await request(app)
            .post("/api/players")
            .set("Authorization", `Bearer ${aliceToken}`)
            .send({ username: "bob-player" });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            username: "bob-player",
            elo: 1200,
            rating: "beginner",
        });
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("createdAt");
    });
});