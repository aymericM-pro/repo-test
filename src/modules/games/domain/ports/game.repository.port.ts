import { GameEntity, GameStatus, TimeControl } from "@/modules/games/domain/game.entity";

export interface IGameRepository {
  findAll(): Promise<GameEntity[]>;
  findById(id: string): Promise<GameEntity | null>;
  findByPlayer(userId: string, status?: GameStatus): Promise<GameEntity[]>;
  save(game: GameEntity): Promise<GameEntity>;
}

export const GAME_REPOSITORY = Symbol("IGameRepository");
