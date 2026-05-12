import { IRequest, IHandler, RequestConstructor } from '@/mediator/interfaces';

class Mediator {
  private readonly handlers = new Map<Function, IHandler<any, any>>();

  register<TRequest extends IRequest<TResponse>, TResponse>(
    requestClass: RequestConstructor<TRequest>,
    handler: IHandler<TRequest, TResponse>,
  ): void {
    if (this.handlers.has(requestClass)) {
      throw new Error(`Handler already registered for: ${requestClass.name}`);
    }
    this.handlers.set(requestClass, handler);
  }

  async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
    const handler = this.handlers.get(request.constructor);
    if (!handler) {
      throw new Error(`No handler registered for: ${request.constructor.name}`);
    }
    return handler.handle(request);
  }
}

export const mediator = new Mediator();
