import winston from 'winston';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// No need for __dirname in ES modules with process.cwd()
import type { Logger, Loggable } from './logger.types.js';

/**
 * Converts an unknown error to a loggable object
 */
function toLoggable(error: unknown): Loggable {
  if (error instanceof Error) {
    const errorObject: Record<string, unknown> = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
    // Add any additional properties from the error object
    Object.getOwnPropertyNames(error).forEach((key) => {
      if (!(key in errorObject)) {
        errorObject[key] = (error as unknown as Record<string, unknown>)[key];
      }
    });
    return errorObject;
  }
  if (typeof error === 'object' && error !== null) {
    return error as Record<string, unknown>;
  }
  return String(error);
}

// Extend the winston.transports type to include DailyRotateFile
declare module 'winston' {
  interface Transports {
    DailyRotateFile: typeof DailyRotateFile;
  }
}

// Format helpers are used directly from format object

// Create logs directory if it doesn't exist
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = format.printf(({ level, message, label, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${label}] ${level}: ${message}${metaString}`;
});

// Helper function to create a logger instance
const createWinstonLogger = (label: string) => {
  const transports: winston.transport[] = [
    // Write all logs with level 'error' and below to 'error.log'
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
    // Write all logs with level 'info' and below to 'combined.log'
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ];

  // If we're not in production, log to the console as well
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: format.combine(
          format.colorize({ all: true }),
          format.timestamp({ format: 'HH:mm:ss' }),
          format.printf(
            ({ level: logLevel, message: logMessage, timestamp: logTime }) =>
              `${logTime} [${label}] ${logLevel}: ${logMessage}`
          )
        ),
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.errors({ stack: true }),
      logFormat
    ),
    defaultMeta: { service: 'clipcraftr-bot' },
    transports,
  });
};

// Create the logger factory function
function createLogger(label: string): Logger {
  const winstonLogger = createWinstonLogger(label);

  // Helper function to handle logging with proper error handling
  const createLogMethod = (level: string) => {
    return (message: string, meta?: Loggable) => {
      try {
        const logMeta = meta !== undefined ? { meta: toLoggable(meta) } : undefined;
        winstonLogger[level as keyof winston.Logger](message, logMeta);
      } catch (error) {
        // If logging itself fails, log the error to stderr
        console.error(`[Logger Error] Failed to log message: ${message}`, error);
      }
    };
  };

  return {
    error: createLogMethod('error'),
    warn: createLogMethod('warn'),
    info: createLogMethod('info'),
    http: createLogMethod('http'),
    verbose: createLogMethod('verbose'),
    debug: createLogMethod('debug'),
    silly: createLogMethod('silly'),
  };
}

// Create a default logger instance
const defaultLogger = createLogger('app');

// Export the logger function as both default and named export
const logger = (label: string) => createLogger(label);
Object.assign(logger, defaultLogger);

export { createLogger, logger };
export default logger;
