import { Router, Request, Response, NextFunction } from "express";
import { getRoutes, getMiddlewares } from "@/decorators/http.decorators";
import { getParams } from "@/decorators/param.decorators";
import {
  getValidatedBody,
  resolveValidatedBody,
} from "@/decorators/validated-body.decorator";

export class RouterFactory {
  static create(ControllerClass: new () => any): Router {
    const instance = new ControllerClass();
    const router = Router({ mergeParams: true });
    const routes = getRoutes(ControllerClass);
    const middlewares = getMiddlewares(ControllerClass);

    if (middlewares.length > 0) {
      router.use(...(middlewares as any[]));
    }

    for (const route of routes) {
      router[route.method](
        route.path,
        this.buildHandler(instance, route.handlerKey as string),
      );
    }

    return router;
  }

  private static buildHandler(instance: any, methodKey: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paramDefs = getParams(instance, methodKey);
        const validated = getValidatedBody(instance, methodKey);
        const args: any[] = new Array(paramDefs.length);

        for (const p of paramDefs) {
          if (p.type === "body" && validated) {
            const dto = await resolveValidatedBody(
              validated.DtoClass,
              req.body,
              res,
            );
            if (dto === null) return;
            args[p.index] = dto;
          } else {
            args[p.index] = this.resolveParam(p.type, p.key, req);
          }
        }

        const result = await instance[methodKey](...args);

        if (!res.headersSent) {
          if (result?.__type === "file") {
            res.setHeader("Content-Type", result.contentType);
            res.setHeader(
              "Content-Disposition",
              `inline; filename="${result.filename}"`,
            );
            res.send(result.buffer);
          } else {
            result === undefined ? res.status(204).send() : res.json(result);
          }
        }
      } catch (err) {
        next(err);
      }
    };
  }

  private static resolveParam(
    type: string,
    key: string | undefined,
    req: Request,
  ): any {
    switch (type) {
      case "param":
        return req.params[key!];
      case "query":
        return req.query[key!];
      case "userId":
        return (req as any).userId;
      case "body":
        return req.body;
      default:
        return undefined;
    }
  }
}
