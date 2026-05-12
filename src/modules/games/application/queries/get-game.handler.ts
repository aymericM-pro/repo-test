import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { GetGameQuery } from "@/modules/games/application/queries/get-game.query";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import {
  IGameRepository,
  GAME_REPOSITORY,
} from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { gameNotFound } from "@/modules/games/domain/game.errors";
import { container } from "@/container";

@Handler(GetGameQuery)
export class GetGameHandler implements IHandler<GetGameQuery, GameResponseDto> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(query: GetGameQuery): Promise<GameResponseDto> {
    const game = await this.repo.findById(query.gameId);
    if (!game) throw gameNotFound(query.gameId);
    return GameMapper.toResponse(game);
  }
}
