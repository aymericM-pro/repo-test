export interface IRequest<TResponse = void> {
  readonly _responseType: TResponse;
}

export interface IHandler<TRequest extends IRequest<TResponse>, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

export type RequestConstructor<T extends IRequest<any>> = new (...args: any[]) => T;
