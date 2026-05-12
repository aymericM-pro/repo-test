import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePlayerRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  elo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rating?: string;
}
