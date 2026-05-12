import { IRequest } from '@/mediator/interfaces';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';

export class CreatePlayerCommand implements IRequest<PlayerResponseDto> {
  declare readonly _responseType: PlayerResponseDto;

  constructor(
    public readonly username: string,
    public readonly elo: number,
    public readonly rating: string,
  ) {}
}
