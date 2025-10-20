/**
 * Logger utility for AI agents
 */

export class Logger {
  private context: string;
  private logLevel: LogLevel;

  constructor(context: string, logLevel: LogLevel = 'info') {
    this.context = context;
    this.logLevel = logLevel;
  }

  public debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      this.log('DEBUG', message, data);
    }
  }

  public info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      this.log('INFO', message, data);
    }
  }

  public success(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      this.log('SUCCESS', message, data, '\x1b[32m'); // Green
    }
  }

  public warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      this.log('WARN', message, data, '\x1b[33m'); // Yellow
    }
  }

  public error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      this.log('ERROR', message, error, '\x1b[31m'); // Red
    }
  }

  private log(level: string, message: string, data?: any, color?: string): void {
    const timestamp = new Date().toISOString();
    const reset = '\x1b[0m';
    const colorCode = color || '\x1b[37m'; // Default white

    let logMessage = `${colorCode}[${timestamp}] [${this.context}] [${level}]${reset} ${message}`;

    if (data) {
      if (data instanceof Error) {
        logMessage += `\n  ${data.message}`;
        if (data.stack) {
          logMessage += `\n  ${data.stack}`;
        }
      } else if (typeof data === 'object') {
        logMessage += `\n  ${JSON.stringify(data, null, 2)}`;
      } else {
        logMessage += `\n  ${data}`;
      }
    }

    console.log(logMessage);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[this.logLevel];
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export default Logger;
