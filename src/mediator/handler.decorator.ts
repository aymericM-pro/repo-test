import { mediator } from '@/mediator/mediator';
import { IHandler, IRequest, RequestConstructor } from '@/mediator/interfaces';

export function Handler<TRequest extends IRequest<TResponse>, TResponse>(
  requestClass: RequestConstructor<TRequest>,
) {
  return function (constructor: new () => IHandler<TRequest, TResponse>) {
    mediator.register(requestClass, new constructor());
  };
}
