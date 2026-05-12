import { IRequest } from '@/mediator/interfaces';
import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';

export class UpdateUserCommand implements IRequest<UserResponseDto> {
  declare readonly _responseType: UserResponseDto;
  constructor(
    public readonly userId:    string,
    public readonly username?: string,
    public readonly password?: string,
  ) {}
}
