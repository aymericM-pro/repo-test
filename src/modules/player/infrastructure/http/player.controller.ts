import { mediator } from '@/mediator/mediator';
import { Controller, Get, Post, Patch, UseMiddleware } from '@/decorators/http.decorators';
import { CurrentUser, Param } from '@/decorators/param.decorators';
import { ValidatedBody } from '@/decorators/validated-body.decorator';
import { authenticate } from '@/middlewares/auth.middleware';
import { GetPlayerQuery } from '@/modules/player/application/queries/get-player.query';
import { CreatePlayerCommand } from '@/modules/player/application/commands/create-player.command';
import { PatchPlayerCommand } from '@/modules/player/application/commands/patch-player.command';
import { CreatePlayerRequestDto } from '@/modules/player/application/dtos/create-player.request.dto';
import { PatchPlayerRequestDto } from '@/modules/player/application/dtos/patch-player.request.dto';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';
import { CreateGameCommand } from '@/modules/games/application/commands/create-game.command';
import { CreateGameRequestDto } from '@/modules/games/application/dtos/game.request.dto';
import { GameResponseDto } from '@/modules/games/application/dtos/game.response.dto';

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

  @Patch('/:playerId')
  async patch(
    @Param('playerId') playerId: string,
    @ValidatedBody(PatchPlayerRequestDto) dto: PatchPlayerRequestDto,
  ): Promise<PlayerResponseDto> {
    return mediator.send(new PatchPlayerCommand(
      playerId,
      dto.username,
      dto.elo,
      dto.rating,
      dto.bio,
      dto.country,
      dto.preferredColor,
    ));
  }

  @Post('/:playerId/games')
  async createGame(
    @Param('playerId') playerId: string,
    @CurrentUser() userId: string,
    @ValidatedBody(CreateGameRequestDto) dto: CreateGameRequestDto,
  ): Promise<GameResponseDto> {
    return mediator.send(new CreateGameCommand(
      userId,
      dto.timeControl,
      dto.timeLimit,
      dto.increment,
      playerId,
      dto.opponent ?? null,
    ));
  }
}
