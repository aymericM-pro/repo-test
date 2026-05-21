import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IGameRepository } from '@/modules/games/domain/ports/game.repository.port';
import { GameEntity, GameStatus, TimeControl, Color } from '@/modules/games/domain/game.entity';
import { GameErrorCode } from '@/modules/games/domain/game.errors';
import { FileValidationError } from '@/storage/validators/file.validator';

vi.mock('@/container', () => ({
  container: { resolve: vi.fn() },
  storageService: {},
}));

import { UploadGamePgnHandler } from '@/modules/games/application/commands/upload-game-pgn.handler';
import { UploadGamePgnCommand } from '@/modules/games/application/commands/upload-game-pgn.command';
import { StorageService } from '@/storage/storage.service';
import { FakeGcpStorageProvider } from '@/storage/providers/gcp/fake-gcp-storage.provider';

const WHITE_ID = 'user-white';
const BLACK_ID = 'user-black';
const GAME_ID  = 'game-1';

function makeGame(overrides?: Partial<{ whiteId: string; blackId: string | null }>): GameEntity {
  return new GameEntity(
    GAME_ID,
    overrides?.whiteId ?? WHITE_ID,
    overrides?.blackId ?? BLACK_ID,
    GameStatus.ACTIVE,
    null,
    null,
    TimeControl.RAPID,
    600,
    0,
    600,
    600,
    [],
    Color.WHITE,
    0,
    null,
    new Date(),
    new Date(),
    new Date(),
    null,
    null,
  );
}

function makeMockRepo(overrides?: Partial<IGameRepository>): IGameRepository {
  return {
    findAll:    vi.fn(),
    findById:   vi.fn(),
    findByPlayer: vi.fn(),
    save:       vi.fn(),
    ...overrides,
  };
}

function makePgnBuffer(sizeBytes?: number): Buffer {
  const content = sizeBytes
    ? Buffer.alloc(sizeBytes, 'a')
    : Buffer.from('[Event "Test"]\n[White "Alice"]\n1. e4 e5 *\n');
  return content;
}

function makeHandler(repo: IGameRepository, fakeProvider?: FakeGcpStorageProvider) {
  const provider = fakeProvider ?? new FakeGcpStorageProvider();
  const storage  = new StorageService(provider);
  return new UploadGamePgnHandler(repo, storage);
}

describe('UploadGamePgnHandler', () => {
  let fakeProvider: FakeGcpStorageProvider;

  beforeEach(() => {
    fakeProvider = new FakeGcpStorageProvider();
  });

  it('stores the file and returns a signed URL on success', async () => {
    const game    = makeGame();
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(game) });
    const handler = makeHandler(repo, fakeProvider);

    const url = await handler.handle(
      new UploadGamePgnCommand(GAME_ID, WHITE_ID, 'game.pgn', makePgnBuffer()),
    );

    expect(url).toContain('fake-storage.example.com');
    expect(url).toContain(`games/${GAME_ID}`);
    expect(fakeProvider.files.size).toBe(1);
  });

  it('also accepts the black player as uploader', async () => {
    const game    = makeGame();
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(game) });
    const handler = makeHandler(repo, fakeProvider);

    const url = await handler.handle(
      new UploadGamePgnCommand(GAME_ID, BLACK_ID, 'game.pgn', makePgnBuffer()),
    );

    expect(url).toContain('fake-storage.example.com');
  });

  it('throws GAME_NOT_FOUND when the game does not exist', async () => {
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const handler = makeHandler(repo, fakeProvider);

    await expect(
      handler.handle(new UploadGamePgnCommand(GAME_ID, WHITE_ID, 'game.pgn', makePgnBuffer())),
    ).rejects.toMatchObject({ code: GameErrorCode.NOT_FOUND, statusCode: 404 });
  });

  it('throws GAME_PLAYER_NOT_IN_GAME when the user is not in the game', async () => {
    const game    = makeGame();
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(game) });
    const handler = makeHandler(repo, fakeProvider);

    await expect(
      handler.handle(new UploadGamePgnCommand(GAME_ID, 'outsider-id', 'game.pgn', makePgnBuffer())),
    ).rejects.toMatchObject({ code: GameErrorCode.PLAYER_NOT_IN_GAME, statusCode: 403 });
  });

  it('throws FileValidationError when the file exceeds 5MB', async () => {
    const game    = makeGame();
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(game) });
    const handler = makeHandler(repo, fakeProvider);

    const bigBuffer = makePgnBuffer(6 * 1024 * 1024);

    await expect(
      handler.handle(new UploadGamePgnCommand(GAME_ID, WHITE_ID, 'game.pgn', bigBuffer)),
    ).rejects.toBeInstanceOf(FileValidationError);
  });

  it('throws FileValidationError when the extension is not .pgn', async () => {
    const game    = makeGame();
    const repo    = makeMockRepo({ findById: vi.fn().mockResolvedValue(game) });
    const handler = makeHandler(repo, fakeProvider);

    await expect(
      handler.handle(new UploadGamePgnCommand(GAME_ID, WHITE_ID, 'malware.exe', makePgnBuffer())),
    ).rejects.toBeInstanceOf(FileValidationError);
  });
});
