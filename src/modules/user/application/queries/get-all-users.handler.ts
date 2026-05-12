import { Handler }          from '@/mediator/handler.decorator';
import { IHandler }         from '@/mediator/interfaces';
import { GetAllUsersQuery } from '@/modules/user/application/queries/get-all-users.query';
import { IUserRepository, USER_REPOSITORY } from '@/modules/user/domain/ports/user.repository.port';
import { UserMapper }       from '@/modules/user/application/mappers/user.mapper';
import { UserResponseDto }  from '@/modules/user/application/dtos/user.response.dto';
import { container }        from '@/container';

@Handler(GetAllUsersQuery)
export class GetAllUsersHandler implements IHandler<GetAllUsersQuery, UserResponseDto[]> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(): Promise<UserResponseDto[]> {
    const users = await this.repo.findAll();
    return users.map(UserMapper.toResponse);
  }
}
