import { Handler }          from "@/mediator/handler.decorator";
import { IHandler }          from "@/mediator/interfaces";
import { PlayMoveCommand }   from "@/modules/games/application/commands/play-move.command";
import { GameResponseDto }   from "@/modules/games/application/dtos/game.response.dto";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper }        from "@/modules/games/application/mappers/game.mapper";
import { gameNotFound }      from "@/modules/games/domain/game.errors";
import { GameResult, EndReason, Color, GameStatus } from "@/modules/games/domain/game.entity";
import { container }         from "@/container";
import { logger }            from "@/container";

@Handler(PlayMoveCommand)
export class PlayMoveHandler implements IHandler<PlayMoveCommand, GameResponseDto> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(cmd: PlayMoveCommand): Promise<GameResponseDto> {
    const game = await this.repo.findById(cmd.gameId);
    if (!game) throw gameNotFound(cmd.gameId);

    if (game.status !== GameStatus.ACTIVE) {
      logger.warn("playMove called on non-active game", { gameId: cmd.gameId, status: game.status });
      return GameMapper.toResponse(game);
    }

    const colorBeforeMove = game.currentTurn;

    game.applyMove({
      san:         cmd.san,
      from:        cmd.from,
      to:          cmd.to,
      isCheck:     cmd.isCheck,
      isCheckmate: cmd.isCheckmate,
      timeLeft:    cmd.timeLeft,
      promotion:   cmd.promotion as any,
    });

    if (cmd.isCheckmate) {
      // The player who just moved wins
      const result = colorBeforeMove === Color.WHITE ? GameResult.WHITE : GameResult.BLACK;
      game.finish(result, EndReason.CHECKMATE);
    }

    return GameMapper.toResponse(await this.repo.save(game));
  }
}
