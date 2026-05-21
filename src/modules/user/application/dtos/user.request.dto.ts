import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty() @IsEmail()
  email!: string;

  @IsNotEmpty() @IsString() @MaxLength(50)
  username!: string;

  @IsNotEmpty() @IsString() @MinLength(8)
  password!: string;
}

export class UpdateUserRequestDto {
  @IsOptional() @IsString() @MaxLength(50)
  username?: string;

  @IsOptional() @IsString() @MinLength(8)
  password?: string;
}

export class PatchUserRequestDto {
  @IsOptional() @IsString() @MaxLength(100)
  firstName?: string;

  @IsOptional() @IsString() @MaxLength(100)
  lastName?: string;
}
