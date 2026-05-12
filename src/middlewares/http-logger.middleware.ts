import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { ILogger } from "@/logger/logger.port";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      log: ILogger;
    }
  }
}

export function httpLogger(rootLogger: ILogger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestId = (req.headers["x-request-id"] as string) ?? randomUUID();
    req.requestId = requestId;
    req.log = rootLogger.child({ requestId });

    const startedAt = Date.now();

    // Sanitise les champs sensibles
    const sanitizedBody = sanitizeBody(req.body);

    req.log.info("incoming request", {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip ?? req.headers["x-forwarded-for"],
      userAgent: req.headers["user-agent"],
      query: Object.keys(req.query).length ? req.query : undefined,
      body: sanitizedBody,
    });

    res.on("finish", () => {
      const duration = Date.now() - startedAt;
      const ctx = {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userId: (req as any).userId, // ton champ auth
        ip: req.ip,
      };

      if (res.statusCode >= 500)
        req.log.error("request completed", undefined, ctx);
      else if (res.statusCode >= 400) req.log.warn("request completed", ctx);
      else req.log.info("request completed", ctx);
    });

    next();
  };
}

const SENSITIVE_FIELDS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
]);

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.has(k.toLowerCase()) ? "***" : v,
    ]),
  );
}
