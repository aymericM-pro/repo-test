import { mediator } from '@/mediator/mediator';
import { Controller, Post } from '@/decorators/http.decorators';
import { ValidatedBody } from '@/decorators/validated-body.decorator';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { RegisterCommand } from '@/modules/auth/application/commands/register.command';
import { LoginRequestDto, RegisterRequestDto } from '@/modules/auth/application/dtos/auth.request.dto';
import { AuthResponseDto } from '@/modules/auth/application/dtos/auth.response.dto';

@Controller('/api/auth')
export class AuthController {
  @Post('/login')
  async login(
    @ValidatedBody(LoginRequestDto) dto: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    return mediator.send(new LoginCommand(dto.email, dto.password));
  }

  @Post('/register')
  async register(
    @ValidatedBody(RegisterRequestDto) dto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    return mediator.send(new RegisterCommand(dto.email, dto.username, dto.password));
  }
}
