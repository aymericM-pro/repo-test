import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
import {
  Color,
  GameStatus,
  GameResult,
  EndReason,
  TimeControl,
  GameMove,
} from "@/modules/games/domain/game.entity";

@Entity("games")
export class GameOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "white_id", type: "uuid" })
  whiteId!: string;

  @Column({ name: "black_id", type: "uuid", nullable: true })
  blackId!: string | null;

  @Column({ type: "enum", enum: GameStatus, default: GameStatus.WAITING })
  status!: GameStatus;

  @Column({ type: "enum", enum: GameResult, nullable: true })
  result!: GameResult | null;

  @Column({ name: "end_reason", type: "enum", enum: EndReason, nullable: true })
  endReason!: EndReason | null;

  @Column({ name: "time_control", type: "enum", enum: TimeControl })
  timeControl!: TimeControl;

  @Column({ name: "time_limit", type: "int" })
  timeLimit!: number;

  @Column({ name: "increment", type: "int", default: 0 })
  increment!: number;

  @Column({ name: "white_time_left", type: "int" })
  whiteTimeLeft!: number;

  @Column({ name: "black_time_left", type: "int" })
  blackTimeLeft!: number;

  @Column({ type: "jsonb", default: "[]" })
  moves!: GameMove[];

  @Column({
    name: "current_turn",
    type: "enum",
    enum: Color,
    default: Color.WHITE,
  })
  currentTurn!: Color;

  @Column({ name: "move_count", type: "int", default: 0 })
  moveCount!: number;

  @Column({ name: "last_move_at", type: "timestamp", nullable: true })
  lastMoveAt!: Date | null;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  startedAt!: Date | null;

  @Column({ name: "finished_at", type: "timestamp", nullable: true })
  finishedAt!: Date | null;

  @Column({ name: "draw_offered_by", type: "uuid", nullable: true })
  drawOfferedBy!: string | null;

  @Column({ name: "player_id", type: "uuid", nullable: true })
  playerId!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
