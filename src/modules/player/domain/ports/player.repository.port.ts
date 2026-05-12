import { PlayerEntity } from '@/modules/player/domain/player.entity';

export interface IPlayerRepository {
  findById(id: string): Promise<PlayerEntity | null>;
}

export const PLAYER_REPOSITORY = Symbol('IPlayerRepository');
