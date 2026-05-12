import { PlayerEntity } from '@/modules/player/domain/player.entity';

export interface IPlayerRepository {
  findById(id: string): Promise<PlayerEntity | null>;
  findByUsername(username: string): Promise<PlayerEntity | null>;
  save(entity: PlayerEntity): Promise<PlayerEntity>;
}

export const PLAYER_REPOSITORY = Symbol('IPlayerRepository');
