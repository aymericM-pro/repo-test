import { Handler } from '@/mediator/handler.decorator';
import { IHandler } from '@/mediator/interfaces';
import { container } from '@/container';
import { PatchPlayerCommand } from '@/modules/player/application/commands/patch-player.command';
import { IPlayerRepository, PLAYER_REPOSITORY } from '@/modules/player/domain/ports/player.repository.port';
import { PlayerMapper } from '@/modules/player/application/mappers/player.mapper';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';
import { playerNotFound } from '@/modules/player/domain/player.errors';

@Handler(PatchPlayerCommand)
export class PatchPlayerHandler implements IHandler<PatchPlayerCommand, PlayerResponseDto> {
  private readonly repo: IPlayerRepository;

  constructor(repo?: IPlayerRepository) {
    this.repo = repo ?? container.resolve(PLAYER_REPOSITORY);
  }

  async handle(cmd: PatchPlayerCommand): Promise<PlayerResponseDto> {
    const player = await this.repo.findById(cmd.playerId);
    if (!player) throw playerNotFound(cmd.playerId);

    if (cmd.username       !== undefined) player.username       = cmd.username;
    if (cmd.elo            !== undefined) player.elo            = cmd.elo;
    if (cmd.rating         !== undefined) player.rating         = cmd.rating;
    if (cmd.bio            !== undefined) player.bio            = cmd.bio;
    if (cmd.country        !== undefined) player.country        = cmd.country;
    if (cmd.preferredColor !== undefined) player.preferredColor = cmd.preferredColor;

    return PlayerMapper.toResponse(await this.repo.save(player));
  }
}
