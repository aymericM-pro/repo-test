import "reflect-metadata";
import { AppDataSource } from "@/data-source";
import { beforeAll, afterAll, afterEach, vi } from "vitest";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

afterEach(async () => {
  await AppDataSource.query(
    "TRUNCATE TABLE parties, games, players, users CASCADE",
  );
});

vi.mock("@/emails/nodemailer.provider", () => ({
  NodemailerProvider: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue(undefined),
  })),
}));
