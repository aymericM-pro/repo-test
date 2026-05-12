import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { GetGameReportQuery } from "@/modules/games/application/queries/get-game-report.query";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { IUserRepository, USER_REPOSITORY } from "@/modules/user/domain/ports/user.repository.port";
import { gameNotFound } from "@/modules/games/domain/game.errors";
import { PdfPayload } from "@/pdf/pdf.types";
import { container } from "@/container";

@Handler(GetGameReportQuery)
export class GetGameReportHandler implements IHandler<GetGameReportQuery, PdfPayload<"game.report">> {
  private readonly games: IGameRepository;
  private readonly users: IUserRepository;

  constructor(games?: IGameRepository, users?: IUserRepository) {
    this.games = games ?? container.resolve(GAME_REPOSITORY);
    this.users = users ?? container.resolve(USER_REPOSITORY);
  }

  async handle(query: GetGameReportQuery): Promise<PdfPayload<"game.report">> {
    const game = await this.games.findById(query.gameId);
    if (!game) throw gameNotFound(query.gameId);

    const [white, black] = await Promise.all([
      this.users.findById(game.whiteId),
      game.blackId ? this.users.findById(game.blackId) : Promise.resolve(null),
    ]);

    return {
      gameId:        game.id,
      whiteUsername: white?.username ?? game.whiteId,
      blackUsername: black?.username ?? null,
      timeControl:   game.timeControl,
      timeLimit:     game.timeLimit,
      increment:     game.increment,
      status:        game.status,
      result:        game.result as "white" | "black" | "draw" | null,
      endReason:     game.endReason,
      moveCount:     game.moveCount,
      startedAt:     game.startedAt,
      finishedAt:    game.finishedAt,
      moves:         game.moves.map((m) => ({
        san:      m.san,
        color:    m.color,
        timeLeft: m.timeLeft,
      })),
    };
  }
}
