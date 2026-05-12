import { AppError } from '@/errors/app-error';

export enum UserErrorCode {
  NOT_FOUND            = 'USER_NOT_FOUND',
  ALREADY_EXISTS       = 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS  = 'USER_INVALID_CREDENTIALS',
}

const STATUS_MAP: Record<UserErrorCode, number> = {
  [UserErrorCode.NOT_FOUND]:           404,
  [UserErrorCode.ALREADY_EXISTS]:      409,
  [UserErrorCode.INVALID_CREDENTIALS]: 401,
};

export const userNotFound           = (id: string)    => new AppError(UserErrorCode.NOT_FOUND,           STATUS_MAP[UserErrorCode.NOT_FOUND],           `User ${id} not found`);
export const userAlreadyExists      = (email: string) => new AppError(UserErrorCode.ALREADY_EXISTS,      STATUS_MAP[UserErrorCode.ALREADY_EXISTS],      `User with email ${email} already exists`);
export const invalidCredentials     = ()              => new AppError(UserErrorCode.INVALID_CREDENTIALS, STATUS_MAP[UserErrorCode.INVALID_CREDENTIALS], 'Invalid email or password');
