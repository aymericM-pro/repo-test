import { Handler }           from '@/mediator/handler.decorator';
import { IHandler }          from '@/mediator/interfaces';
import { DeleteUserCommand } from '@/modules/user/application/commands/delete-user.command';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { userNotFound }      from '@/modules/user/domain/user.errors';
import { container }         from '@/container';

@Handler(DeleteUserCommand)
export class DeleteUserHandler implements IHandler<DeleteUserCommand, void> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(cmd: DeleteUserCommand): Promise<void> {
    const user = await this.repo.findById(cmd.userId);
    if (!user) throw userNotFound(cmd.userId);
    await this.repo.delete(user);
  }
}
