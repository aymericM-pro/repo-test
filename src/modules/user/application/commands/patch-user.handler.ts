import { Handler }          from '@/mediator/handler.decorator';
import { IHandler }          from '@/mediator/interfaces';
import { PatchUserCommand }  from '@/modules/user/application/commands/patch-user.command';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { UserMapper }        from '@/modules/user/application/mappers/user.mapper';
import { UserResponseDto }   from '@/modules/user/application/dtos/user.response.dto';
import { userNotFound }      from '@/modules/user/domain/user.errors';
import { container }         from '@/container';

@Handler(PatchUserCommand)
export class PatchUserHandler implements IHandler<PatchUserCommand, UserResponseDto> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(cmd: PatchUserCommand): Promise<UserResponseDto> {
    const user = await this.repo.findById(cmd.userId);
    if (!user) throw userNotFound(cmd.userId);

    if (cmd.firstName !== undefined) user.firstName = cmd.firstName;
    if (cmd.lastName  !== undefined) user.lastName  = cmd.lastName;

    return UserMapper.toResponse(await this.repo.save(user));
  }
}
