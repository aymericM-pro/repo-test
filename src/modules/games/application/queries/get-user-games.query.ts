import { IRequest } from "@/mediator/interfaces";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";

export class GetUserGamesQuery implements IRequest<GameResponseDto[]> {
  declare readonly _responseType: GameResponseDto[];
  constructor(public readonly userId: string) {}
}
