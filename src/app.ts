import "reflect-metadata";
import express from "express";
import { join } from "path";
import { connectDatabase } from "@/data-source";
import { loadHandlers } from "@/mediator/loader";
import { RouterFactory } from "@/router/router.factory";
import { UserController } from "@/modules/user/infrastructure/http/user.controller";
import { GameController } from "@/modules/games/infrastructure/http/game.controller";
import { AuthController } from "@/modules/auth/infrastructure/http/auth.controller";
import { getPrefix } from "@/decorators/http.decorators";
import { httpLogger } from "@/middlewares/http-logger.middleware";
import { errorHandler } from "@/middlewares/error.middleware";
import { logger } from "@/container";

async function bootstrap() {
  const app  = express();
  const port = Number(process.env.PORT ?? 3000);

  app.use(express.json());
  app.use(httpLogger(logger));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  const controllers = [UserController, GameController, AuthController];
  for (const Controller of controllers) {
    app.use(getPrefix(Controller), RouterFactory.create(Controller));
  }

  app.use(errorHandler);

  await loadHandlers(join(__dirname, "modules"));
  await connectDatabase();

  logger.info(`app running on http://localhost:${port}`, { port });
  app.listen(port);
}

bootstrap().catch((err) => {
  logger.error("fatal error during bootstrap", err instanceof Error ? err : new Error(String(err)));
  process.exit(1);
});
