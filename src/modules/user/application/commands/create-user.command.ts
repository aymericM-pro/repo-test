import { IRequest } from '@/mediator/interfaces';
import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';

export class CreateUserCommand implements IRequest<UserResponseDto> {
  declare readonly _responseType: UserResponseDto;
  constructor(
    public readonly email:    string,
    public readonly username: string,
    public readonly password: string,
  ) {}
}
