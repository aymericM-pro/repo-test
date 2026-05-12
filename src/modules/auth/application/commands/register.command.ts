import { IRequest } from '@/mediator/interfaces';
import { AuthResponseDto } from '@/modules/auth/application/dtos/auth.response.dto';

export class RegisterCommand implements IRequest<AuthResponseDto> {
  declare readonly _responseType: AuthResponseDto;
  constructor(
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
  ) {}
}
