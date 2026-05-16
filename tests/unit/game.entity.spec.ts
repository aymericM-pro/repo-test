import { describe, it, expect, beforeEach } from 'vitest';
import {
  GameEntity,
  GameStatus,
  GameResult,
  TimeControl,
  EndReason,
  Color,
} from '@/modules/games/domain/game.entity';
import { AppError } from '@/errors/app-error';
import { GameErrorCode } from '@/modules/games/domain/game.errors';

function makeWaitingGame(overrides?: Partial<{ whiteId: string }>): GameEntity {
  return GameEntity.create({
    id: 'game-1',
    whiteId: overrides?.whiteId ?? 'user-white',
    timeControl: TimeControl.BLITZ,
    timeLimit: 300_000,
    increment: 5_000,
  });
}

function makeActiveGame(): GameEntity {
  const game = makeWaitingGame();
  game.join('user-black');
  return game;
}

describe('GameEntity.create', () => {
  it('initialises with WAITING status and correct time values', () => {
    const game = makeWaitingGame();
    expect(game.status).toBe(GameStatus.WAITING);
    expect(game.blackId).toBeNull();
    expect(game.result).toBeNull();
    expect(game.whiteTimeLeft).toBe(300_000);
    expect(game.blackTimeLeft).toBe(300_000);
    expect(game.moveCount).toBe(0);
    expect(game.currentTurn).toBe(Color.WHITE);
    expect(game.isWaiting).toBe(true);
    expect(game.isActive).toBe(false);
    expect(game.isFinished).toBe(false);
  });
});

describe('GameEntity.join', () => {
  it('sets ACTIVE status, assigns blackId, and records startedAt', () => {
    const game = makeWaitingGame();
    game.join('user-black');
    expect(game.status).toBe(GameStatus.ACTIVE);
    expect(game.blackId).toBe('user-black');
    expect(game.startedAt).toBeInstanceOf(Date);
    expect(game.isActive).toBe(true);
  });

  it('throws GAME_ALREADY_STARTED when game is not WAITING', () => {
    const game = makeActiveGame();
    expect(() => game.join('user-other')).toThrow(
      expect.objectContaining({ code: GameErrorCode.ALREADY_STARTED }),
    );
  });

  it('throws GAME_CANNOT_JOIN_OWN when blackId equals whiteId', () => {
    const game = makeWaitingGame({ whiteId: 'user-white' });
    expect(() => game.join('user-white')).toThrow(
      expect.objectContaining({ code: GameErrorCode.CANNOT_JOIN_OWN }),
    );
  });
});

describe('GameEntity.resign', () => {
  it('sets BLACK as winner when white resigns', () => {
    const game = makeActiveGame();
    game.resign('user-white');
    expect(game.result).toBe(GameResult.BLACK);
    expect(game.endReason).toBe(EndReason.RESIGNATION);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe('user-black');
  });

  it('sets WHITE as winner when black resigns', () => {
    const game = makeActiveGame();
    game.resign('user-black');
    expect(game.result).toBe(GameResult.WHITE);
    expect(game.winner).toBe('user-white');
  });

  it('throws GAME_ALREADY_FINISHED when game is not ACTIVE', () => {
    const game = makeActiveGame();
    game.finish();
    expect(() => game.resign('user-white')).toThrow(
      expect.objectContaining({ code: GameErrorCode.ALREADY_FINISHED }),
    );
  });

  it('throws GAME_PLAYER_NOT_IN_GAME when user is not a participant', () => {
    const game = makeActiveGame();
    expect(() => game.resign('user-stranger')).toThrow(
      expect.objectContaining({ code: GameErrorCode.PLAYER_NOT_IN_GAME }),
    );
  });
});

describe('GameEntity.offerDraw', () => {
  it('sets drawOfferedBy to the offering user', () => {
    const game = makeActiveGame();
    game.offerDraw('user-white');
    expect(game.drawOfferedBy).toBe('user-white');
  });

  it('throws GAME_DRAW_ALREADY_OFFERED when a draw is already pending', () => {
    const game = makeActiveGame();
    game.offerDraw('user-white');
    expect(() => game.offerDraw('user-black')).toThrow(
      expect.objectContaining({ code: GameErrorCode.DRAW_ALREADY_OFFERED }),
    );
  });

  it('throws GAME_ALREADY_FINISHED when game is not ACTIVE', () => {
    const game = makeActiveGame();
    game.finish();
    expect(() => game.offerDraw('user-white')).toThrow(
      expect.objectContaining({ code: GameErrorCode.ALREADY_FINISHED }),
    );
  });
});

describe('GameEntity.acceptDraw', () => {
  it('finishes the game with DRAW result when a valid offer exists', () => {
    const game = makeActiveGame();
    game.offerDraw('user-white');
    game.acceptDraw('user-black');
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.result).toBe(GameResult.DRAW);
    expect(game.endReason).toBe(EndReason.DRAW_AGREEMENT);
    expect(game.isDraw).toBe(true);
    expect(game.winner).toBeNull();
  });

  it('throws GAME_DRAW_NO_OFFER when there is no pending offer', () => {
    const game = makeActiveGame();
    expect(() => game.acceptDraw('user-black')).toThrow(
      expect.objectContaining({ code: GameErrorCode.DRAW_NO_OFFER }),
    );
  });

  it('throws GAME_DRAW_NO_OFFER when the same player tries to accept their own offer', () => {
    const game = makeActiveGame();
    game.offerDraw('user-white');
    expect(() => game.acceptDraw('user-white')).toThrow(
      expect.objectContaining({ code: GameErrorCode.DRAW_NO_OFFER }),
    );
  });
});

describe('GameEntity.declineDraw', () => {
  it('clears drawOfferedBy when a valid offer exists', () => {
    const game = makeActiveGame();
    game.offerDraw('user-white');
    game.declineDraw('user-black');
    expect(game.drawOfferedBy).toBeNull();
    expect(game.status).toBe(GameStatus.ACTIVE);
  });

  it('throws GAME_DRAW_NO_OFFER when there is no pending offer', () => {
    const game = makeActiveGame();
    expect(() => game.declineDraw('user-black')).toThrow(
      expect.objectContaining({ code: GameErrorCode.DRAW_NO_OFFER }),
    );
  });
});

describe('GameEntity getters', () => {
  it('lastMove returns null for a new game and the last move after moves are applied', () => {
    const game = makeActiveGame();
    expect(game.lastMove).toBeNull();

    game.applyMove({ san: 'e4', from: 'e2', to: 'e4', isCheck: false, isCheckmate: false, timeLeft: 295_000 });
    expect(game.lastMove?.san).toBe('e4');
    expect(game.lastMove?.moveNumber).toBe(1);
  });

  it('durationMs returns null for unfinished games and a positive number after finish', () => {
    const game = makeActiveGame();
    expect(game.durationMs).toBeNull();
    game.finish();
    expect(typeof game.durationMs).toBe('number');
    expect(game.durationMs).toBeGreaterThanOrEqual(0);
  });
});
