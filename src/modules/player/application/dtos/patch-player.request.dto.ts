import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class PatchPlayerRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  elo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rating?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredColor?: string;
}
