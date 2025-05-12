import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Define log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Environment check
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = !!process.env.VERCEL;

// Log level configuration
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const LOG_TO_FILE = process.env.LOG_TO_FILE === 'true' || !isProduction;

// Log directory setup for local development
const LOG_DIR = process.env.LOG_DIR || 'logs';
if (LOG_TO_FILE && !isVercel) {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch (err) {
    console.error(`Failed to create log directory: ${err}`);
  }
}

// Log level priority
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Logger implementation
class Logger {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL as LogLevel];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.source}] ${message}${dataStr}`;
  }

  private async writeToFile(formattedMessage: string): Promise<void> {
    if (LOG_TO_FILE && !isVercel) {
      try {
        const logFile = path.join(LOG_DIR, `${format(new Date(), 'yyyy-MM-dd')}.log`);
        await fs.promises.appendFile(logFile, formattedMessage + '\n');
      } catch (err) {
        console.error(`Failed to write to log file: ${err}`);
      }
    }
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    // Always log to console
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // Async write to file if configured
    void this.writeToFile(formattedMessage);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }
}

// Create a logger factory function
export function createLogger(source: string): Logger {
  return new Logger(source);
}

// Create a default logger
export const logger = createLogger('app');

// Export a global error handler
export function logError(error: unknown, context = 'global'): void {
  const errorLogger = createLogger(context);
  if (error instanceof Error) {
    errorLogger.error(error.message, { stack: error.stack });
  } else {
    errorLogger.error('An unknown error occurred', { error });
  }
}
