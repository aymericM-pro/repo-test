import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";
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

  @IsOptional()
  @IsUUID('all')
  opponent?: string;
}

export class PlayMoveRequestDto {
  @IsString() @MaxLength(15)
  san!: string;

  @IsString() @MaxLength(2)
  from!: string;

  @IsString() @MaxLength(2)
  to!: string;

  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  isCheck!: boolean;

  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  isCheckmate!: boolean;

  @IsOptional() @IsString() @MaxLength(1)
  promotion?: string;

  @Transform(({ value }) => Number(value))
  @IsInt() @Min(0)
  timeLeft!: number;
}