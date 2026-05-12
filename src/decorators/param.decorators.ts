import 'reflect-metadata';

export const PARAMS_KEY = Symbol('params');

export type ParamType = 'body' | 'param' | 'query' | 'userId';

export interface ParamDefinition {
  index: number;
  type:  ParamType;
  key?:  string;
}

function createParamDecorator(type: ParamType, key?: string) {
  return (target: object, methodKey: string | symbol, paramIndex: number) => {
    const params: ParamDefinition[] =
      Reflect.getMetadata(PARAMS_KEY, target, methodKey) ?? [];
    params.push({ index: paramIndex, type, key });
    Reflect.defineMetadata(PARAMS_KEY, params, target, methodKey);
  };
}

export const Param       = (key: string) => createParamDecorator('param',  key);
export const QueryParam  = (key: string) => createParamDecorator('query',  key);
export const Body        = ()            => createParamDecorator('body');
export const CurrentUser = ()            => createParamDecorator('userId');

export function getParams(target: object, methodKey: string | symbol): ParamDefinition[] {
  return Reflect.getMetadata(PARAMS_KEY, target, methodKey) ?? [];
}
