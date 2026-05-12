import { IRequest } from "@/mediator/interfaces";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";

export class SimulateGameCommand implements IRequest<GameResponseDto> {
  declare readonly _responseType: GameResponseDto;
  constructor(
    public readonly gameId: string,
    public readonly blackId: string,
  ) {}
}
