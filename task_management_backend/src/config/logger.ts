type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const level: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

export const logger = {
  debug: (...args: unknown[]) => {
    if (level === 'debug') console.debug('[DEBUG]', ...args);
  },
  info: (...args: unknown[]) => {
    if (['debug', 'info'].includes(level)) console.info('[INFO]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (['debug', 'info', 'warn'].includes(level)) console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
};
