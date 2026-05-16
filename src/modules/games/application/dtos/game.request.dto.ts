import { IsEnum, IsInt, IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import { TimeControl } from "@/modules/games/domain/game.entity";

export class CreateGameRequestDto {
  @IsEnum(TimeControl)
  timeControl!: TimeControl;

  @IsInt()
  @IsPositive()
  timeLimit!: number;

  @IsInt()
  @Min(0)
  increment!: number;

  @IsOptional()
  @IsUUID()
  playerId?: string;
}
