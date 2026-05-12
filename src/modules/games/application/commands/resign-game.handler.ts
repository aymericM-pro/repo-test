import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { ResignGameCommand } from "@/modules/games/application/commands/resign-game.command";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { gameNotFound } from "@/modules/games/domain/game.errors";
import { container } from "@/container";

@Handler(ResignGameCommand)
export class ResignGameHandler implements IHandler<ResignGameCommand, GameResponseDto> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(cmd: ResignGameCommand): Promise<GameResponseDto> {
    const game = await this.repo.findById(cmd.gameId);
    if (!game) throw gameNotFound(cmd.gameId);

    game.resign(cmd.userId);

    return GameMapper.toResponse(await this.repo.save(game));
  }
}
