import bcrypt                from 'bcrypt';
import { Handler }           from '@/mediator/handler.decorator';
import { IHandler }          from '@/mediator/interfaces';
import { UpdateUserCommand } from '@/modules/user/application/commands/update-user.command';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { UserMapper }        from '@/modules/user/application/mappers/user.mapper';
import { UserResponseDto }   from '@/modules/user/application/dtos/user.response.dto';
import { userNotFound }      from '@/modules/user/domain/user.errors';
import { container }         from '@/container';

@Handler(UpdateUserCommand)
export class UpdateUserHandler implements IHandler<UpdateUserCommand, UserResponseDto> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(cmd: UpdateUserCommand): Promise<UserResponseDto> {
    const user = await this.repo.findById(cmd.userId);
    if (!user) throw userNotFound(cmd.userId);

    if (cmd.username) user.username     = cmd.username;
    if (cmd.password) user.passwordHash = await bcrypt.hash(cmd.password, 10);

    return UserMapper.toResponse(await this.repo.save(user));
  }
}
