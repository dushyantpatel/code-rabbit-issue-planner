import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import config from './configLoader.js';

// Use Winston's TransformableInfo type directly, with optional additions
type LogInfo = winston.Logform.TransformableInfo & {
    context?: string;
};

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

// Tell winston about our colors
winston.addColors(colors);

// Define the logger instance
const logger = winston.createLogger({
    level: config.logging.level,
    levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
            const timestamp = info.timestamp ?? new Date().toISOString();
            const context = (info as LogInfo).context ?? 'App';
            const message = String(info.message);
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            return `${timestamp} [${info.level}] [${context}]: ${message}`;
        }),
    ),
    transports: [
        // Console transport (conditional based on config)
        ...(config.logging.console.enabled
            ? [
                  new winston.transports.Console({
                      format: winston.format.combine(
                          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
                          // Only colorize if specified in config
                          ...(config.logging.console.colorized ? [winston.format.colorize()] : []),
                          winston.format.printf((info: winston.Logform.TransformableInfo) => {
                              const timestamp = info.timestamp ?? new Date().toISOString();
                              const context = (info as LogInfo).context ?? 'App';
                              const message = String(info.message);
                              // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                              return `${timestamp} [${info.level}] [${context}]: ${message}`;
                          }),
                      ),
                  }),
              ]
            : []),
        // File transports (conditional based on config)
        ...(config.logging.file.enabled
            ? [
                  // File transport for all logs
                  new winston.transports.File({
                      filename: config.logging.file.path,
                  }),
                  // Separate file for errors
                  new winston.transports.File({
                      filename: config.logging.file.errorPath,
                      level: 'error',
                  }),
              ]
            : []),
    ],
});

// Helper functions to add context to logs
export const log = {
    error: (message: string, context?: string) => logger.error({ message, context }),
    warn: (message: string, context?: string) => logger.warn({ message, context }),
    info: (message: string, context?: string) => logger.info({ message, context }),
    http: (message: string, context?: string) => logger.http({ message, context }),
    debug: (message: string, context?: string) => logger.debug({ message, context }),
};

// Create a middleware function for logging HTTP requests
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Once the request is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        // Log based on status code
        if (res.statusCode >= 500) {
            log.error(message, 'HTTP');
        } else if (res.statusCode >= 400) {
            log.warn(message, 'HTTP');
        } else {
            log.http(message, 'HTTP');
        }
    });

    next();
};
