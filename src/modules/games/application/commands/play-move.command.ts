import { IRequest } from "@/mediator/interfaces";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";

export class PlayMoveCommand implements IRequest<GameResponseDto> {
  declare readonly _responseType: GameResponseDto;
  constructor(
    public readonly gameId:      string,
    public readonly san:         string,
    public readonly from:        string,
    public readonly to:          string,
    public readonly isCheck:     boolean,
    public readonly isCheckmate: boolean,
    public readonly timeLeft:    number,
    public readonly promotion?:  string,
  ) {}
}
