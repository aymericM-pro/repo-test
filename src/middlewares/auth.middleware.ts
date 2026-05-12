import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '@/errors/app-error';

export enum AuthErrorCode {
  MISSING_TOKEN = 'AUTH_MISSING_TOKEN',
  INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  EXPIRED_TOKEN = 'AUTH_EXPIRED_TOKEN',
}

const STATUS_MAP: Record<AuthErrorCode, number> = {
  [AuthErrorCode.MISSING_TOKEN]: 401,
  [AuthErrorCode.INVALID_TOKEN]: 401,
  [AuthErrorCode.EXPIRED_TOKEN]: 401,
};

export const missingToken = () => new AppError(AuthErrorCode.MISSING_TOKEN, STATUS_MAP[AuthErrorCode.MISSING_TOKEN], 'Missing authorization token');
export const invalidToken = () => new AppError(AuthErrorCode.INVALID_TOKEN, STATUS_MAP[AuthErrorCode.INVALID_TOKEN], 'Invalid token');
export const expiredToken = () => new AppError(AuthErrorCode.EXPIRED_TOKEN, STATUS_MAP[AuthErrorCode.EXPIRED_TOKEN], 'Token has expired');

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(missingToken());

  try {
    const payload = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET ?? 'secret',
    ) as { sub: string; exp?: number };

    req.userId = payload.sub;
    next();
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') return next(expiredToken());
    return next(invalidToken());
  }
}
