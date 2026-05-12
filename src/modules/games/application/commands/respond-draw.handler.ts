import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { RespondDrawCommand } from "@/modules/games/application/commands/respond-draw.command";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import {
  IGameRepository,
  GAME_REPOSITORY,
} from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { gameNotFound } from "@/modules/games/domain/game.errors";
import { container } from "@/container";

@Handler(RespondDrawCommand)
export class RespondDrawHandler implements IHandler<
  RespondDrawCommand,
  GameResponseDto
> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(cmd: RespondDrawCommand): Promise<GameResponseDto> {
    const game = await this.repo.findById(cmd.gameId);
    if (!game) {
      throw gameNotFound(cmd.gameId);
    }

    if (cmd.accept) {
      game.acceptDraw(cmd.userId);
    } else {
      game.declineDraw(cmd.userId);
    }

    return GameMapper.toResponse(await this.repo.save(game));
  }
}
