import { UserEntity }      from '@/modules/user/domain/user.entity';
import { UserResponseDto } from '@/modules/user/application/dtos/user.response.dto';
import { UserOrmEntity }   from '@/modules/user/infrastructure/persistence/user.orm-entity';

export class UserMapper {
  static toResponse(entity: UserEntity): UserResponseDto {
    const dto       = new UserResponseDto();
    dto.id          = entity.id;
    dto.email       = entity.email;
    dto.username    = entity.username;
    dto.createdAt   = entity.createdAt;
    dto.firstName   = entity.firstName;
    dto.lastName    = entity.lastName;
    return dto;
  }

  static toDomain(orm: UserOrmEntity): UserEntity {
    return new UserEntity(orm.id, orm.email, orm.username, orm.passwordHash, orm.createdAt, orm.firstName, orm.lastName);
  }

  static toOrm(entity: UserEntity): UserOrmEntity {
    const orm        = new UserOrmEntity();
    orm.id           = entity.id;
    orm.email        = entity.email;
    orm.username     = entity.username;
    orm.passwordHash = entity.passwordHash;
    orm.createdAt    = entity.createdAt;
    orm.firstName    = entity.firstName;
    orm.lastName     = entity.lastName;
    return orm;
  }
}
