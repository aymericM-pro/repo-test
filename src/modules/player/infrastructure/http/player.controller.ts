import { mediator } from '@/mediator/mediator';
import { Controller, Get } from '@/decorators/http.decorators';
import { Param } from '@/decorators/param.decorators';
import { GetPlayerQuery } from '@/modules/player/application/queries/get-player.query';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';

@Controller('/api/players')
export class PlayerController {
  @Get('/:playerId')
  async getOne(@Param('playerId') playerId: string): Promise<PlayerResponseDto> {
    return mediator.send(new GetPlayerQuery(playerId));
  }
}
