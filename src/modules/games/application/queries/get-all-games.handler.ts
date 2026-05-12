import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { GetAllGamesQuery } from "@/modules/games/application/queries/get-all-games.query";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import {
  IGameRepository,
  GAME_REPOSITORY,
} from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { container } from "@/container";

@Handler(GetAllGamesQuery)
export class GetAllGamesHandler implements IHandler<GetAllGamesQuery, GameResponseDto[]> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(): Promise<GameResponseDto[]> {
    const games = await this.repo.findAll();
    return games.map(GameMapper.toResponse);
  }
}
