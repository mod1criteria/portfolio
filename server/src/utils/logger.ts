import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir: string = path.resolve(__dirname, '..', '..', 'log');
const backupDir: string = path.join(logDir, 'backup');

/**
 * Ensure the log directory exists.
 * If it does not exist, create it recursively.
 */
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * DailyRotateFile transport for Winston logger.
 * This transport creates a new log file every day and keeps backups for 30 days.
 */
const rotateTransport: DailyRotateFile = new DailyRotateFile({
  dirname: logDir,
  filename: path.join('backup', 'WebNote_%DATE%.log'),
  datePattern: 'YYYY_MM_DD',
  maxFiles: '30d',
  createSymlink: true,
  symlinkName: 'WebNote.log',
});

/**
 * Logger instance for the application.
 * This logger uses Winston with daily rotation to manage log files.
 * It formats log messages with a timestamp, class name, function name, and title.
 */
export const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY_MM_DD HH:mm:ss' }),
    format.printf(({ timestamp, message, className, funcName, title }) => {
      return `${String(timestamp)} [${String(className)}] [${String(funcName)}] ${String(title)} - ${String(message)}`;
    }),
  ),
  transports: [rotateTransport],
});

/**
 * Utility function to get the caller's class and function name.
 * This is useful for logging purposes to identify where the log is coming from.
 */
function getCallerInfo(): { className: string; funcName: string } {
  // Capture the stack trace to find the caller's class and function name
  const obj: { stack?: string } = {};
  Error.captureStackTrace(obj, getCallerInfo);
  const stackLines: string[] = obj.stack?.split('\n') ?? [];
  const callerLine: string = stackLines[2] ?? '';
  const match: RegExpMatchArray | null = callerLine.match(/at (.+?) /);
  const fullFunc: string = match ? match[1] : 'anonymous';
  const parts: string[] = fullFunc.split('.');
  const funcName: string = parts.pop() || 'anonymous';
  const className: string = parts.pop() || 'global';
  return { className, funcName };
}

/**
 * Logs a message with the specified title.
 * This function captures the caller's class and function name
 * to provide context in the log output.
 * @param title - The title of the log message.
 * @param message - The message to log.
 * @return void
 * */
export function log(title: string, message: string) {
  const { className, funcName } = getCallerInfo();
  logger.info(message, { className, funcName, title });
}
