import { AppDataSource }   from '@/data-source';
import { IUserRepository } from '@/modules/user/domain/ports/user.repository.port';
import { UserEntity }      from '@/modules/user/domain/user.entity';
import { UserOrmEntity }   from '@/modules/user/infrastructure/persistence/user.orm-entity';
import { UserMapper }      from '@/modules/user/application/mappers/user.mapper';

export class UserRepositoryAdapter implements IUserRepository {
  private readonly orm = AppDataSource.getRepository(UserOrmEntity);

  async findAll(): Promise<UserEntity[]> {
    return (await this.orm.find()).map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const row = await this.orm.findOne({ where: { id } });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.orm.findOne({ where: { email } });
    return row ? UserMapper.toDomain(row) : null;
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    return UserMapper.toDomain(await this.orm.save(UserMapper.toOrm(entity)));
  }

  async delete(entity: UserEntity): Promise<void> {
    await this.orm.delete({ id: entity.id });
  }
}
