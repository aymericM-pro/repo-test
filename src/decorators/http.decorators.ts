import 'reflect-metadata';

const ROUTES_KEY     = Symbol('routes');
const MIDDLEWARE_KEY = Symbol('middleware');
const CONTROLLER_KEY = Symbol('controller_prefix');

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RouteDefinition {
  method:     HttpMethod;
  path:       string;
  handlerKey: string | symbol;
}

// ── Classe ────────────────────────────────────────────────────────────────────

export function Controller(prefix: string) {
  return (target: Function) => {
    Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
  };
}

export function UseMiddleware(...middlewares: Function[]) {
  return (target: Function) => {
    Reflect.defineMetadata(MIDDLEWARE_KEY, middlewares, target);
  };
}

// ── Méthodes ──────────────────────────────────────────────────────────────────

function createMethodDecorator(method: HttpMethod, path: string) {
  return (target: object, key: string | symbol) => {
    const routes: RouteDefinition[] =
      Reflect.getMetadata(ROUTES_KEY, target.constructor) ?? [];
    routes.push({ method, path, handlerKey: key });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export const Get    = (path = '/') => createMethodDecorator('get',    path);
export const Post   = (path = '/') => createMethodDecorator('post',   path);
export const Put    = (path = '/') => createMethodDecorator('put',    path);
export const Patch  = (path = '/') => createMethodDecorator('patch',  path);
export const Delete = (path = '/') => createMethodDecorator('delete', path);

// ── Lecture métadonnées ───────────────────────────────────────────────────────

export function getRoutes(target: Function): RouteDefinition[] {
  return Reflect.getMetadata(ROUTES_KEY, target) ?? [];
}

export function getPrefix(target: Function): string {
  return Reflect.getMetadata(CONTROLLER_KEY, target) ?? '/';
}

export function getMiddlewares(target: Function): Function[] {
  return Reflect.getMetadata(MIDDLEWARE_KEY, target) ?? [];
}
