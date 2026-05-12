import { AppDataSource } from '@/data-source';
import { IPlayerRepository } from '@/modules/player/domain/ports/player.repository.port';
import { PlayerEntity } from '@/modules/player/domain/player.entity';
import { PlayerOrmEntity } from '@/modules/player/infrastructure/persistence/player.orm-entity';
import { PlayerMapper } from '@/modules/player/application/mappers/player.mapper';

export class PlayerRepositoryAdapter implements IPlayerRepository {
  private readonly orm = AppDataSource.getRepository(PlayerOrmEntity);

  async findById(id: string): Promise<PlayerEntity | null> {
    const row = await this.orm.findOne({ where: { id } });
    return row ? PlayerMapper.toDomain(row) : null;
  }

  async findByUsername(username: string): Promise<PlayerEntity | null> {
    const row = await this.orm.findOne({ where: { username } });
    return row ? PlayerMapper.toDomain(row) : null;
  }

  async save(entity: PlayerEntity): Promise<PlayerEntity> {
    const saved = await this.orm.save(PlayerMapper.toOrm(entity));
    return PlayerMapper.toDomain(saved);
  }
}
