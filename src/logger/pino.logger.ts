import pino, { Logger as PinoInstance } from 'pino';
import { ILogger } from '@/logger/logger.port';

const isDev = process.env.NODE_ENV !== 'production';

function buildPinoOptions(): pino.LoggerOptions & { transport?: unknown } {
  const base = { level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info') };

  if (isDev) {
    return {
      ...base,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
      },
    };
  }

  return {
    ...base,
    transport: {
      targets: [
        { target: 'pino/file', level: 'info', options: { destination: 1 } },
        { target: 'pino-roll', level: 'info', options: { file: './logs/app.log', frequency: 'daily', mkdir: true } },
      ],
    },
  };
}

export class PinoLogger implements ILogger {
  private constructor(private readonly instance: PinoInstance) {}

  static create(): PinoLogger {
    return new PinoLogger(pino(buildPinoOptions() as pino.LoggerOptions));
  }

  info(msg: string, context?: Record<string, unknown>): void {
    this.instance.info(context ?? {}, msg);
  }

  warn(msg: string, context?: Record<string, unknown>): void {
    this.instance.warn(context ?? {}, msg);
  }

  error(msg: string, err?: Error, context?: Record<string, unknown>): void {
    this.instance.error({ err, ...context }, msg);
  }

  debug(msg: string, context?: Record<string, unknown>): void {
    this.instance.debug(context ?? {}, msg);
  }

  child(bindings: Record<string, unknown>): ILogger {
    return new PinoLogger(this.instance.child(bindings));
  }
}
