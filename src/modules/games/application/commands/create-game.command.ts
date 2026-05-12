import { IRequest } from "@/mediator/interfaces";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import { TimeControl } from "@/modules/games/domain/game.entity";

export class CreateGameCommand implements IRequest<GameResponseDto> {
  declare readonly _responseType: GameResponseDto;
  constructor(
    public readonly whiteId: string,
    public readonly timeControl: TimeControl,
    public readonly timeLimit: number,
    public readonly increment: number,
  ) {}
}
