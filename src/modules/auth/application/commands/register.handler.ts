import { randomUUID } from 'crypto';
import { Handler } from '@/mediator/handler.decorator';
import { IHandler } from '@/mediator/interfaces';
import { RegisterCommand } from '@/modules/auth/application/commands/register.command';
import { AuthResponseDto } from '@/modules/auth/application/dtos/auth.response.dto';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { IHashService, HASH_SERVICE } from '@/modules/auth/domain/ports/hash.service.port';
import { ITokenService, TOKEN_SERVICE } from '@/modules/auth/domain/ports/token.service.port';
import { IPlayerRepository, PLAYER_REPOSITORY } from '@/modules/player/domain/ports/player.repository.port';
import { UserEntity } from '@/modules/user/domain/user.entity';
import { PlayerEntity } from '@/modules/player/domain/player.entity';
import { UserMapper } from '@/modules/user/application/mappers/user.mapper';
import { userAlreadyExists } from '@/modules/user/domain/user.errors';
import { container, emailService } from '@/container';

@Handler(RegisterCommand)
export class RegisterHandler implements IHandler<RegisterCommand, AuthResponseDto> {
  private readonly repo: IUserRepository;
  private readonly hash: IHashService;
  private readonly token: ITokenService;
  private readonly playerRepo: IPlayerRepository;

  constructor(repo?: IUserRepository, hash?: IHashService, token?: ITokenService, playerRepo?: IPlayerRepository) {
    this.repo       = repo       ?? container.resolve(USER_REPOSITORY);
    this.hash       = hash       ?? container.resolve(HASH_SERVICE);
    this.token      = token      ?? container.resolve(TOKEN_SERVICE);
    this.playerRepo = playerRepo ?? container.resolve(PLAYER_REPOSITORY);
  }

  async handle(cmd: RegisterCommand): Promise<AuthResponseDto> {
    const existing = await this.repo.findByEmail(cmd.email);
    if (existing) throw userAlreadyExists(cmd.email);

    const user = UserEntity.create({
      id:           randomUUID(),
      email:        cmd.email,
      username:     cmd.username,
      passwordHash: await this.hash.hash(cmd.password),
    });

    const saved = await this.repo.save(user);

    await this.playerRepo.save(
      PlayerEntity.create({ id: saved.id, username: saved.username, elo: 1200, rating: 'beginner' }),
    );

    emailService.send('user.welcome', { to: saved.email, username: saved.username });

    const dto = new AuthResponseDto();
    dto.token = this.token.sign(saved.id);
    dto.user  = UserMapper.toResponse(saved);
    return dto;
  }
}
