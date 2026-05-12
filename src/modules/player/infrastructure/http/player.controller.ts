import { mediator } from '@/mediator/mediator';
import { Controller, Get, Post, UseMiddleware } from '@/decorators/http.decorators';
import { Param } from '@/decorators/param.decorators';
import { ValidatedBody } from '@/decorators/validated-body.decorator';
import { authenticate } from '@/middlewares/auth.middleware';
import { GetPlayerQuery } from '@/modules/player/application/queries/get-player.query';
import { CreatePlayerCommand } from '@/modules/player/application/commands/create-player.command';
import { CreatePlayerRequestDto } from '@/modules/player/application/dtos/create-player.request.dto';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';

@UseMiddleware(authenticate)
@Controller('/api/players')
export class PlayerController {
  @Get('/:playerId')
  async getOne(@Param('playerId') playerId: string): Promise<PlayerResponseDto> {
    return mediator.send(new GetPlayerQuery(playerId));
  }

  @Post('/')
  async create(
    @ValidatedBody(CreatePlayerRequestDto) dto: CreatePlayerRequestDto,
  ): Promise<PlayerResponseDto> {
    return mediator.send(new CreatePlayerCommand(
      dto.username,
      dto.elo ?? 1200,
      dto.rating ?? 'beginner',
    ));
  }
}
