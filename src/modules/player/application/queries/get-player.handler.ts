import { Handler } from '@/mediator/handler.decorator';
import { IHandler } from '@/mediator/interfaces';
import { GetPlayerQuery } from '@/modules/player/application/queries/get-player.query';
import { IPlayerRepository, PLAYER_REPOSITORY } from '@/modules/player/domain/ports/player.repository.port';
import { PlayerMapper } from '@/modules/player/application/mappers/player.mapper';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';
import { playerNotFound } from '@/modules/player/domain/player.errors';
import { container } from '@/container';

@Handler(GetPlayerQuery)
export class GetPlayerHandler implements IHandler<GetPlayerQuery, PlayerResponseDto> {
  private readonly repo: IPlayerRepository;

  constructor(repo?: IPlayerRepository) {
    this.repo = repo ?? container.resolve(PLAYER_REPOSITORY);
  }

  async handle(query: GetPlayerQuery): Promise<PlayerResponseDto> {
    const player = await this.repo.findById(query.playerId);
    if (!player) throw playerNotFound(query.playerId);
    return PlayerMapper.toResponse(player);
  }
}
