import {
  Color,
  GameStatus,
  GameResult,
  EndReason,
  TimeControl,
  GameMove,
} from "@/modules/games/domain/game.entity";

export class GameResponseDto {
  id!: string;
  whiteId!: string;
  blackId!: string | null;
  status!: GameStatus;
  result!: GameResult | null;
  endReason!: EndReason | null;
  timeControl!: TimeControl;
  timeLimit!: number;
  increment!: number;
  whiteTimeLeft!: number;
  blackTimeLeft!: number;
  moves!: GameMove[];
  currentTurn!: Color;
  moveCount!: number;
  lastMoveAt!: Date | null;
  startedAt!: Date | null;
  finishedAt!: Date | null;
  createdAt!: Date;
  drawOfferedBy!:  string | null;
  playerId!:       string | null;
  whiteUsername?:  string;
  blackUsername?:  string | null;
}
