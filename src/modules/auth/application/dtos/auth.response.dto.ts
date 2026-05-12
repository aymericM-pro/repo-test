import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';

export class AuthResponseDto {
  token!: string;
  user!: UserResponseDto;
}
