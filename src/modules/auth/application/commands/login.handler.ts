import { Handler } from '@/mediator/handler.decorator';
import { IHandler } from '@/mediator/interfaces';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { AuthResponseDto } from '@/modules/auth/application/dtos/auth.response.dto';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { IHashService, HASH_SERVICE } from '@/modules/auth/domain/ports/hash.service.port';
import { ITokenService, TOKEN_SERVICE } from '@/modules/auth/domain/ports/token.service.port';
import { UserMapper } from '@/modules/user/application/mappers/user.mapper';
import { invalidCredentials } from '@/modules/user/domain/user.errors';
import { container } from '@/container';

@Handler(LoginCommand)
export class LoginHandler implements IHandler<LoginCommand, AuthResponseDto> {
  private readonly repo: IUserRepository;
  private readonly hash: IHashService;
  private readonly token: ITokenService;

  constructor(repo?: IUserRepository, hash?: IHashService, token?: ITokenService) {
    this.repo  = repo  ?? container.resolve(USER_REPOSITORY);
    this.hash  = hash  ?? container.resolve(HASH_SERVICE);
    this.token = token ?? container.resolve(TOKEN_SERVICE);
  }

  async handle(cmd: LoginCommand): Promise<AuthResponseDto> {
    const user = await this.repo.findByEmail(cmd.email);
    const valid = !!user && await this.hash.compare(cmd.password, user.passwordHash);
    if (!valid || !user) throw invalidCredentials();

    const dto = new AuthResponseDto();
    dto.token = this.token.sign(user.id);
    dto.user  = UserMapper.toResponse(user);
    return dto;
  }
}
