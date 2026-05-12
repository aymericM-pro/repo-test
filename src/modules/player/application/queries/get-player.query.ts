import { IRequest } from '@/mediator/interfaces';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';

export class GetPlayerQuery implements IRequest<PlayerResponseDto> {
  declare readonly _responseType: PlayerResponseDto;

  constructor(public readonly playerId: string) {}
}
