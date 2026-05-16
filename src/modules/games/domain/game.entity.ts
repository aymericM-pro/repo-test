import {
  gameAlreadyStarted,
  gameAlreadyFinished,
  gameCannotJoinOwn,
  gamePlayerNotInGame,
  gameDrawNoOffer,
  gameDrawAlreadyOffered,
} from "@/modules/games/domain/game.errors";

export enum Color {
  WHITE = "white",
  BLACK = "black",
}

export enum GameStatus {
  WAITING = "waiting",
  ACTIVE = "active",
  FINISHED = "finished",
}

export enum GameResult {
  WHITE = "white",
  BLACK = "black",
  DRAW = "draw",
}

export enum TimeControl {
  BULLET = "bullet",
  BLITZ = "blitz",
  RAPID = "rapid",
  CLASSICAL = "classical",
}

export enum EndReason {
  CHECKMATE = "checkmate",
  RESIGNATION = "resignation",
  TIMEOUT = "timeout",
  DRAW_AGREEMENT = "draw_agreement",
  STALEMATE = "stalemate",
  ABANDONED = "abandoned",
}

export enum PromotionPiece {
  QUEEN = "q",
  ROOK = "r",
  BISHOP = "b",
  KNIGHT = "n",
}

export interface GameMove {
  moveNumber: number;
  color: Color;
  san: string;
  from: string;
  to: string;
  isCheck: boolean;
  isCheckmate: boolean;
  promotion?: PromotionPiece;
  playedAt: Date;
  timeLeft: number;
}

export class GameEntity {
  constructor(
    public readonly id: string,
    public readonly whiteId: string,
    public blackId: string | null,
    public status: GameStatus,
    public result: GameResult | null,
    public endReason: EndReason | null,
    public readonly timeControl: TimeControl,
    public readonly timeLimit: number,
    public readonly increment: number,
    public whiteTimeLeft: number,
    public blackTimeLeft: number,
    public moves: GameMove[],
    public currentTurn: Color,
    public moveCount: number,
    public lastMoveAt: Date | null,
    public startedAt: Date | null,
    public finishedAt: Date | null,
    public readonly createdAt: Date,
    public drawOfferedBy: string | null = null,
    public playerId: string | null = null,
  ) {}

  static create(params: {
    id: string;
    whiteId: string;
    timeControl: TimeControl;
    timeLimit: number;
    increment: number;
    playerId?: string | null;
  }): GameEntity {
    return new GameEntity(
      params.id,
      params.whiteId,
      null,
      GameStatus.WAITING,
      null,
      null,
      params.timeControl,
      params.timeLimit,
      params.increment,
      params.timeLimit,
      params.timeLimit,
      [],
      Color.WHITE,
      0,
      null,
      null,
      null,
      new Date(),
      null,
      params.playerId ?? null,
    );
  }

  join(blackId: string): void {
    if (this.status !== GameStatus.WAITING) throw gameAlreadyStarted();
    if (this.whiteId === blackId) throw gameCannotJoinOwn();
    this.blackId = blackId;
    this.status = GameStatus.ACTIVE;
    this.startedAt = new Date();
  }

  applyMove(move: Omit<GameMove, "moveNumber" | "color" | "playedAt">): void {
    if (this.status !== GameStatus.ACTIVE) throw gameAlreadyFinished();

    this.moves.push({
      ...move,
      moveNumber: this.moveCount + 1,
      color: this.currentTurn,
      playedAt: new Date(),
    });

    if (this.currentTurn === Color.WHITE) {
      this.whiteTimeLeft = move.timeLeft;
    } else {
      this.blackTimeLeft = move.timeLeft;
    }

    this.currentTurn =
      this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
    this.moveCount += 1;
    this.lastMoveAt = new Date();
  }

  offerDraw(userId: string): void {
    if (this.status !== GameStatus.ACTIVE) throw gameAlreadyFinished();
    this.getColorForUser(userId); // validates player is in game
    if (this.drawOfferedBy) throw gameDrawAlreadyOffered();
    this.drawOfferedBy = userId;
  }

  acceptDraw(userId: string): void {
    if (this.status !== GameStatus.ACTIVE) throw gameAlreadyFinished();
    this.getColorForUser(userId);
    if (!this.drawOfferedBy || this.drawOfferedBy === userId) throw gameDrawNoOffer();
    this.drawOfferedBy = null;
    this.finish(GameResult.DRAW, EndReason.DRAW_AGREEMENT);
  }

  declineDraw(userId: string): void {
    if (this.status !== GameStatus.ACTIVE) throw gameAlreadyFinished();
    this.getColorForUser(userId);
    if (!this.drawOfferedBy || this.drawOfferedBy === userId) throw gameDrawNoOffer();
    this.drawOfferedBy = null;
  }

  resign(userId: string): void {
    if (this.status !== GameStatus.ACTIVE) throw gameAlreadyFinished();
    const color = this.getColorForUser(userId);
    this.result = color === Color.WHITE ? GameResult.BLACK : GameResult.WHITE;
    this.endReason = EndReason.RESIGNATION;
    this.finish();
  }

  finish(result?: GameResult, reason?: EndReason): void {
    if (result) this.result = result;
    if (reason) this.endReason = reason;
    this.status = GameStatus.FINISHED;
    this.finishedAt = new Date();
  }

  getColorForUser(userId: string): Color {
    if (userId === this.whiteId) return Color.WHITE;
    if (userId === this.blackId) return Color.BLACK;
    throw gamePlayerNotInGame();
  }

  isPlayerInGame(userId: string): boolean {
    return userId === this.whiteId || userId === this.blackId;
  }

  isPlayerTurn(userId: string): boolean {
    return this.getColorForUser(userId) === this.currentTurn;
  }

  get isWaiting(): boolean {
    return this.status === GameStatus.WAITING;
  }
  get isActive(): boolean {
    return this.status === GameStatus.ACTIVE;
  }
  get isFinished(): boolean {
    return this.status === GameStatus.FINISHED;
  }
  get isDraw(): boolean {
    return this.result === GameResult.DRAW;
  }

  get lastMove(): GameMove | null {
    return this.moves.at(-1) ?? null;
  }

  get winner(): string | null {
    if (this.result === GameResult.WHITE) return this.whiteId;
    if (this.result === GameResult.BLACK) return this.blackId;
    return null;
  }

  get durationMs(): number | null {
    if (!this.startedAt || !this.finishedAt) return null;
    return this.finishedAt.getTime() - this.startedAt.getTime();
  }
}
