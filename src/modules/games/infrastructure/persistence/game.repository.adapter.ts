import { AppDataSource } from "@/data-source";
import { IGameRepository } from "@/modules/games/domain/ports/game.repository.port";
import { GameEntity, GameStatus } from "@/modules/games/domain/game.entity";
import { GameOrmEntity } from "@/modules/games/infrastructure/persistence/game.orm-entity";
import { GameMapper } from "@/modules/games/application/mappers/game.mapper";

export class GameRepositoryAdapter implements IGameRepository {
  private readonly orm = AppDataSource.getRepository(GameOrmEntity);

  async findAll(): Promise<GameEntity[]> {
    const rows = await this.orm.find();
    return rows.map(GameMapper.toDomain);
  }

  async findById(id: string): Promise<GameEntity | null> {
    const row = await this.orm.findOne({ where: { id } });
    return row ? GameMapper.toDomain(row) : null;
  }

  async findByPlayer(
    userId: string,
    status?: GameStatus,
  ): Promise<GameEntity[]> {
    const qb = this.orm
      .createQueryBuilder("game")
      .where("game.white_id = :userId OR game.black_id = :userId", { userId });

    if (status) {
      qb.andWhere("game.status = :status", { status });
    }

    const rows = await qb.getMany();
    return rows.map(GameMapper.toDomain);
  }

  async save(entity: GameEntity): Promise<GameEntity> {
    const saved = await this.orm.save(GameMapper.toOrm(entity));
    return GameMapper.toDomain(saved);
  }
}
