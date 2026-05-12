import { IRequest } from '@/mediator/interfaces';
import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';

export class GetAllUsersQuery implements IRequest<UserResponseDto[]> {
  declare readonly _responseType: UserResponseDto[];}
