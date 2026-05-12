import { GameEntity } from "@/modules/games/domain/game.entity";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import { GameOrmEntity } from "@/modules/games/infrastructure/persistence/game.orm-entity";

export class GameMapper {
  // Domain → Response DTO
  static toResponse(entity: GameEntity): GameResponseDto {
    const dto = new GameResponseDto();
    dto.id = entity.id;
    dto.whiteId = entity.whiteId;
    dto.blackId = entity.blackId;
    dto.status = entity.status;
    dto.result = entity.result;
    dto.endReason = entity.endReason;
    dto.timeControl = entity.timeControl;
    dto.timeLimit = entity.timeLimit;
    dto.increment = entity.increment;
    dto.whiteTimeLeft = entity.whiteTimeLeft;
    dto.blackTimeLeft = entity.blackTimeLeft;
    dto.moves = entity.moves;
    dto.currentTurn = entity.currentTurn;
    dto.moveCount = entity.moveCount;
    dto.lastMoveAt = entity.lastMoveAt;
    dto.startedAt = entity.startedAt;
    dto.finishedAt = entity.finishedAt;
    dto.createdAt = entity.createdAt;
    dto.drawOfferedBy = entity.drawOfferedBy;
    return dto;
  }

  // ORM → Domain
  static toDomain(orm: GameOrmEntity): GameEntity {
    return new GameEntity(
      orm.id,
      orm.whiteId,
      orm.blackId,
      orm.status,
      orm.result,
      orm.endReason,
      orm.timeControl,
      orm.timeLimit,
      orm.increment,
      orm.whiteTimeLeft,
      orm.blackTimeLeft,
      orm.moves,
      orm.currentTurn,
      orm.moveCount,
      orm.lastMoveAt,
      orm.startedAt,
      orm.finishedAt,
      orm.createdAt,
      orm.drawOfferedBy,
    );
  }

  // Domain → ORM
  static toOrm(entity: GameEntity): GameOrmEntity {
    const orm = new GameOrmEntity();
    orm.id = entity.id;
    orm.whiteId = entity.whiteId;
    orm.blackId = entity.blackId;
    orm.status = entity.status;
    orm.result = entity.result;
    orm.endReason = entity.endReason;
    orm.timeControl = entity.timeControl;
    orm.timeLimit = entity.timeLimit;
    orm.increment = entity.increment;
    orm.whiteTimeLeft = entity.whiteTimeLeft;
    orm.blackTimeLeft = entity.blackTimeLeft;
    orm.moves = entity.moves;
    orm.currentTurn = entity.currentTurn;
    orm.moveCount = entity.moveCount;
    orm.lastMoveAt = entity.lastMoveAt;
    orm.startedAt = entity.startedAt;
    orm.finishedAt = entity.finishedAt;
    orm.drawOfferedBy = entity.drawOfferedBy;
    return orm;
  }
}
