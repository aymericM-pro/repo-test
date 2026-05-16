import { describe, it, expect, vi } from 'vitest';
import { UserEntity } from '@/modules/user/domain/user.entity';
import { IUserRepository } from '@/modules/user/domain/ports/user.repository.port';
import { UserErrorCode } from '@/modules/user/domain/user.errors';

vi.mock('@/container', () => ({ container: { resolve: vi.fn() } }));
vi.mock('@/modules/user/application/mappers/user.mapper', () => ({
  UserMapper: {
    toResponse: vi.fn((e: UserEntity) => ({
      id: e.id,
      email: e.email,
      username: e.username,
      createdAt: e.createdAt,
    })),
  },
}));

import { GetUserHandler } from '@/modules/user/application/queries/get-user.handler';
import { GetUserQuery } from '@/modules/user/application/queries/get-user.query';

function makeUserEntity(): UserEntity {
  return new UserEntity('user-1', 'alice@example.com', 'alice', 'hashed', new Date());
}

function makeMockRepo(overrides?: Partial<IUserRepository>): IUserRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

describe('GetUserHandler', () => {
  it('returns a UserResponseDto when the user exists', async () => {
    const entity = makeUserEntity();
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(entity) });
    const handler = new GetUserHandler(repo);

    const result = await handler.handle(new GetUserQuery('user-1'));

    expect(result.id).toBe('user-1');
    expect(result.email).toBe('alice@example.com');
    expect(result.username).toBe('alice');
    expect(repo.findById).toHaveBeenCalledWith('user-1');
  });

  it('throws USER_NOT_FOUND with status 404 when the user does not exist', async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const handler = new GetUserHandler(repo);

    await expect(handler.handle(new GetUserQuery('missing-id'))).rejects.toMatchObject({
      code: UserErrorCode.NOT_FOUND,
      statusCode: 404,
    });
  });
});
