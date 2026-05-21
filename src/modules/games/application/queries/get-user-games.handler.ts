import { Handler }              from "@/mediator/handler.decorator";
import { IHandler }              from "@/mediator/interfaces";
import { GetUserGamesQuery }     from "@/modules/games/application/queries/get-user-games.query";
import { GameResponseDto }       from "@/modules/games/application/dtos/game.response.dto";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { IUserRepository, USER_REPOSITORY } from "@/modules/user/domain/ports/user.repository.port";
import { GameMapper }            from "@/modules/games/application/mappers/game.mapper";
import { container }             from "@/container";

@Handler(GetUserGamesQuery)
export class GetUserGamesHandler implements IHandler<GetUserGamesQuery, GameResponseDto[]> {
  private readonly gameRepo: IGameRepository;
  private readonly userRepo: IUserRepository;

  constructor(gameRepo?: IGameRepository, userRepo?: IUserRepository) {
    this.gameRepo = gameRepo ?? container.resolve(GAME_REPOSITORY);
    this.userRepo = userRepo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(query: GetUserGamesQuery): Promise<GameResponseDto[]> {
    const games = await this.gameRepo.findByPlayer(query.userId);

    const ids = [...new Set(
      games.flatMap((g) => [g.whiteId, g.blackId]).filter((id): id is string => id !== null),
    )];

    const users = await Promise.all(ids.map((id) => this.userRepo.findById(id)));
    const usernameMap = new Map(
      users.filter((u) => u !== null).map((u) => [u!.id, u!.username]),
    );

    return games.map((g) => {
      const dto = GameMapper.toResponse(g);
      dto.whiteUsername = usernameMap.get(g.whiteId) ?? g.whiteId;
      dto.blackUsername = g.blackId ? (usernameMap.get(g.blackId) ?? g.blackId) : null;
      dto.moves = []; // omit heavy move payload from list — loaded on demand via getOne
      return dto;
    });
  }
}
