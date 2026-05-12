import { randomUUID } from "crypto";
import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { CreateGameCommand } from "@/modules/games/application/commands/create-game.command";
import { GameEntity } from "@/modules/games/domain/game.entity";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import {
  IGameRepository,
  GAME_REPOSITORY,
} from "@/modules/games/domain/ports/game.repository.port";
import { container } from "@/container";

@Handler(CreateGameCommand)
export class CreateGameHandler implements IHandler<
  CreateGameCommand,
  GameResponseDto
> {
  private readonly repo: IGameRepository;

  constructor(repo?: IGameRepository) {
    this.repo = repo ?? container.resolve(GAME_REPOSITORY);
  }

  async handle(cmd: CreateGameCommand): Promise<GameResponseDto> {
    const game = GameEntity.create({
      id: randomUUID(),
      whiteId: cmd.whiteId,
      timeControl: cmd.timeControl,
      timeLimit: cmd.timeLimit,
      increment: cmd.increment,
    });

    return GameMapper.toResponse(await this.repo.save(game));
  }
}
