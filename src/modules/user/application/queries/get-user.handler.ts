import { Handler }         from '@/mediator/handler.decorator';
import { IHandler }        from '@/mediator/interfaces';
import { GetUserQuery }    from '@/modules/user/application/queries/get-user.query';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { UserMapper }      from '@/modules/user/application/mappers/user.mapper';
import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';
import { userNotFound }    from '@/modules/user/domain/user.errors';
import { container }       from '@/container';

@Handler(GetUserQuery)
export class GetUserHandler implements IHandler<GetUserQuery, UserResponseDto> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(query: GetUserQuery): Promise<UserResponseDto> {
    const user = await this.repo.findById(query.userId);
    if (!user) throw userNotFound(query.userId);
    return UserMapper.toResponse(user);
  }
}
