import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { AppError } from '@/errors/app-error';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.requestId ?? (req.headers['x-request-id'] as string) ?? randomUUID();
  const timestamp = new Date().toISOString();
  const path      = req.originalUrl;
  const log       = req.log;

  if (err instanceof AppError) {
    const logFn = err.statusCode >= 500 ? 'error' : 'warn';
    if (logFn === 'error') {
      log?.error('app error', err, { requestId, path, code: err.code, status: err.statusCode });
    } else {
      log?.warn('app error', { requestId, path, code: err.code, status: err.statusCode, stack: err.stack });
    }

    return res.status(err.statusCode).json({ requestId, timestamp, path, code: err.code, message: err.message });
  }

  const error = err instanceof Error ? err : new Error('Unknown error');
  log?.error('unhandled error', error, { requestId, path, stack: error.stack });

  res.status(500).json({ requestId, timestamp, path, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' });
}
