import { IRequest } from '@/mediator/interfaces';

export class DeleteUserCommand implements IRequest<void> {
  declare readonly _responseType: void;
  constructor(public readonly userId: string) {}
}
