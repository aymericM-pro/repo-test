import { randomUUID } from 'crypto';
import { Handler } from '@/mediator/handler.decorator';
import { IHandler } from '@/mediator/interfaces';
import { container } from '@/container';
import { CreatePlayerCommand } from '@/modules/player/application/commands/create-player.command';
import { IPlayerRepository, PLAYER_REPOSITORY } from '@/modules/player/domain/ports/player.repository.port';
import { PlayerEntity } from '@/modules/player/domain/player.entity';
import { PlayerMapper } from '@/modules/player/application/mappers/player.mapper';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';
import { playerUsernameAlreadyExists } from '@/modules/player/domain/player.errors';

@Handler(CreatePlayerCommand)
export class CreatePlayerHandler implements IHandler<CreatePlayerCommand, PlayerResponseDto> {
  private readonly repo: IPlayerRepository;

  constructor(repo?: IPlayerRepository) {
    this.repo = repo ?? container.resolve(PLAYER_REPOSITORY);
  }

  async handle(cmd: CreatePlayerCommand): Promise<PlayerResponseDto> {
    const existing = await this.repo.findByUsername(cmd.username);
    if (existing) throw playerUsernameAlreadyExists(cmd.username);

    const player = PlayerEntity.create({
      id: randomUUID(),
      username: cmd.username,
      elo: cmd.elo,
      rating: cmd.rating,
    });

    return PlayerMapper.toResponse(await this.repo.save(player));
  }
}
