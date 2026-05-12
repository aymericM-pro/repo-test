import { AppError } from '@/errors/app-error';

export const playerNotFound = (id: string) =>
  new AppError('PLAYER_NOT_FOUND', 404, `Player ${id} not found`);

export const playerUsernameAlreadyExists = (username: string) =>
  new AppError('PLAYER_USERNAME_ALREADY_EXISTS', 409, `Username ${username} already taken`);
