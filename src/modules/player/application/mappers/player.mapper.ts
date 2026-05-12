import { PlayerEntity } from '@/modules/player/domain/player.entity';
import { PlayerResponseDto } from '@/modules/player/application/dtos/player.response.dto';
import { PlayerOrmEntity } from '@/modules/player/infrastructure/persistence/player.orm-entity';

export class PlayerMapper {
  static toResponse(entity: PlayerEntity): PlayerResponseDto {
    const dto = new PlayerResponseDto();
    dto.id        = entity.id;
    dto.username  = entity.username;
    dto.elo       = entity.elo;
    dto.rating    = entity.rating;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static toDomain(orm: PlayerOrmEntity): PlayerEntity {
    return new PlayerEntity(orm.id, orm.username, orm.elo, orm.rating, orm.createdAt);
  }

  static toOrm(entity: PlayerEntity): PlayerOrmEntity {
    const orm = new PlayerOrmEntity();
    orm.id        = entity.id;
    orm.username  = entity.username;
    orm.elo       = entity.elo;
    orm.rating    = entity.rating;
    orm.createdAt = entity.createdAt;
    return orm;
  }
}
