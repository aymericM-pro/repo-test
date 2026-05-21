import { IRequest } from '@/mediator/interfaces';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';

export class PatchPlayerCommand implements IRequest<PlayerResponseDto> {
  declare readonly _responseType: PlayerResponseDto;

  constructor(
    public readonly playerId:        string,
    public readonly username?:       string,
    public readonly elo?:            number,
    public readonly rating?:         string,
    public readonly bio?:            string,
    public readonly country?:        string,
    public readonly preferredColor?: string,
  ) {}
}
