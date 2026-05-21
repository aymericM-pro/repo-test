import { mediator }          from '@/mediator/mediator';
import { Controller, Get, Post, Put, Patch, Delete, UseMiddleware } from '@/decorators/http.decorators';
import { Param }             from '@/decorators/param.decorators';
import { authenticate }      from '@/middlewares/auth.middleware';
import { ValidatedBody }     from '@/decorators/validated-body.decorator';
import { GetAllUsersQuery }  from '@/modules/user/application/queries/get-all-users.query';
import { GetUserQuery }      from '@/modules/user/application/queries/get-user.query';
import { CreateUserCommand } from '@/modules/user/application/commands/create-user.command';
import { UpdateUserCommand } from '@/modules/user/application/commands/update-user.command';
import { PatchUserCommand }  from '@/modules/user/application/commands/patch-user.command';
import { DeleteUserCommand } from '@/modules/user/application/commands/delete-user.command';
import { CreateUserRequestDto, UpdateUserRequestDto, PatchUserRequestDto } from '@/modules/user/application/dtos/user.request.dto';
import { UserResponseDto }   from '@/modules/user/application/dtos/user.response.dto';

@UseMiddleware(authenticate)
@Controller('/api/users')
export class UserController {

  @Get('/')
  async getAll(): Promise<UserResponseDto[]> {
    return mediator.send(new GetAllUsersQuery());
  }

  @Get('/:userId')
  async getOne(@Param('userId') userId: string): Promise<UserResponseDto> {
    return mediator.send(new GetUserQuery(userId));
  }

  @Post('/')
  async create(
    @ValidatedBody(CreateUserRequestDto) dto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return mediator.send(new CreateUserCommand(dto.email, dto.username, dto.password));
  }

  @Put('/:userId')
  async update(
    @Param('userId')                     userId: string,
    @ValidatedBody(UpdateUserRequestDto) dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return mediator.send(new UpdateUserCommand(userId, dto.username, dto.password));
  }

  @Patch('/:userId')
  async patch(
    @Param('userId')                    userId: string,
    @ValidatedBody(PatchUserRequestDto) dto: PatchUserRequestDto,
  ): Promise<UserResponseDto> {
    return mediator.send(new PatchUserCommand(userId, dto.firstName, dto.lastName));
  }

  @Delete('/:userId')
  async delete(@Param('userId') userId: string): Promise<void> {
    await mediator.send(new DeleteUserCommand(userId));
  }
}
