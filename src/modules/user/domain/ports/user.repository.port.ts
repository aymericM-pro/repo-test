import { UserEntity } from '@/modules/user/domain/user.entity';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  delete(user: UserEntity): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
