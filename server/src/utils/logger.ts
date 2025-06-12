import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = path.resolve(__dirname, '..', '..', 'log');
const backupDir = path.join(logDir, 'backup');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const rotateTransport = new DailyRotateFile({
  dirname: logDir,
  filename: path.join('backup', 'WebNote_%DATE%.log'),
  datePattern: 'YYYY_MM_DD',
  maxFiles: '30d',
  createSymlink: true,
  symlinkName: 'WebNote.log',
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY_MM_DD HH:mm:ss' }),
    format.printf(({ timestamp, message, className, funcName, title }) => {
      return `${timestamp} [${className}] [${funcName}] ${title} - ${message}`;
    }),
  ),
  transports: [rotateTransport],
});

function getCallerInfo() {
  const obj: { stack?: string } = {};
  Error.captureStackTrace(obj, getCallerInfo);
  const stackLines = obj.stack?.split('\n') ?? [];
  const callerLine = stackLines[2] ?? '';
  const match = callerLine.match(/at (.+?) /);
  const fullFunc = match ? match[1] : 'anonymous';
  const parts = fullFunc.split('.');
  const funcName = parts.pop() || 'anonymous';
  const className = parts.pop() || 'global';
  return { className, funcName };
}

export function log(title: string, message: string) {
  const { className, funcName } = getCallerInfo();
  logger.info(message, { className, funcName, title });
}

