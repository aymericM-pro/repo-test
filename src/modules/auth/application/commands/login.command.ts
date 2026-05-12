import { IRequest } from '@/mediator/interfaces';
import { AuthResponseDto } from '@/modules/auth/application/dtos/auth.response.dto';

export class LoginCommand implements IRequest<AuthResponseDto> {
  declare readonly _responseType: AuthResponseDto;
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
