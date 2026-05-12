import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { SimulateGameCommand } from "@/modules/games/application/commands/simulate-game.command";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { gameNotFound } from "@/modules/games/domain/game.errors";
import { GameStatus, GameResult, EndReason, Color } from "@/modules/games/domain/game.entity";
import { AppError } from "@/errors/app-error";
import { container } from "@/container";

// Scholar's Mate — white wins by checkmate in 4 moves
const MOVES: Array<{
  san: string; from: string; to: string;
  isCheck: boolean; isCheckmate: boolean;
}> = [
  { san: "e4",    from: "e2", to: "e4", isCheck: false, isCheckmate: false },
  { san: "e5",    from: "e7", to: "e5", isCheck: false, isCheckmate: false },
  { san: "Bc4",   from: "f1", to: "c4", isCheck: false, isCheckmate: false },
  { san: "Nc6",   from: "b8", to: "c6", isCheck: false, isCheckmate: false },
  { san: "Qh5",   from: "d1", to: "h5", isCheck: false, isCheckmate: false },
  { san: "Nf6?",  from: "g8", to: "f6", isCheck: false, isCheckmate: false },
  { san: "Qxf7#", from: "h5", to: "f7", isCheck: true,  isCheckmate: true  },
];

@Handler(SimulateGameCommand)
export class SimulateGameHandler implements IHandler<SimulateGameCommand, GameResponseDto> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(cmd: SimulateGameCommand): Promise<GameResponseDto> {
    const game = await this.repo.findById(cmd.gameId);
    if (!game) throw gameNotFound(cmd.gameId);

    if (game.status !== GameStatus.WAITING) {
      throw new AppError("GAME_NOT_WAITING", 409, "Only waiting games can be simulated");
    }

    // Join as black — bypass domain guard to allow same user for testing
    game.blackId    = cmd.blackId;
    game.status     = GameStatus.ACTIVE;
    game.startedAt  = new Date();

    const timePerMove = Math.floor(game.timeLimit / MOVES.length);
    let whiteTimeLeft = game.timeLimit;
    let blackTimeLeft = game.timeLimit;

    for (const move of MOVES) {
      const isWhite = game.currentTurn === Color.WHITE;
      if (isWhite) whiteTimeLeft = Math.max(0, whiteTimeLeft - timePerMove);
      else         blackTimeLeft = Math.max(0, blackTimeLeft - timePerMove);

      game.applyMove({
        san:         move.san,
        from:        move.from,
        to:          move.to,
        isCheck:     move.isCheck,
        isCheckmate: move.isCheckmate,
        timeLeft:    isWhite ? whiteTimeLeft : blackTimeLeft,
      });
    }

    game.finish(GameResult.WHITE, EndReason.CHECKMATE);

    const saved = await this.repo.save(game);
    return GameMapper.toResponse(saved);
  }
}
