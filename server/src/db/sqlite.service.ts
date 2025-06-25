import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Database } from 'sqlite3';
import { join } from 'path';
import { DatabaseService } from './database.service';

@Injectable()
export class SQLiteService
  extends DatabaseService
  implements OnModuleInit, OnModuleDestroy
{
  private db!: Database;

  onModuleInit() {
    const dbPath = join(__dirname, '..', '..', 'data', 'database.sqlite');
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.serialize(() => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )`,
      );
      // older databases may lack the password column
      this.db.run(`ALTER TABLE users ADD COLUMN password TEXT`, () => {});
      this.db.run(
        `CREATE TABLE IF NOT EXISTS refresh_tokens (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          tokenHash TEXT NOT NULL,
          expiresAt INTEGER NOT NULL
        )`,
      );
      this.db.run(
        `CREATE TABLE IF NOT EXISTS calendars (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          name TEXT NOT NULL,
          color TEXT,
          description TEXT
        )`,
      );
      this.db.run(
        `CREATE TABLE IF NOT EXISTS schedules (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          calendarId TEXT NOT NULL,
          title TEXT NOT NULL,
          startDateTime TEXT NOT NULL,
          endDateTime TEXT NOT NULL,
          allDay INTEGER,
          location TEXT,
          alarm TEXT,
          color TEXT,
          isRepeat INTEGER,
          repeatId TEXT,
          participants TEXT,
          description TEXT
        )`,
      );
    });
  }

  onModuleDestroy() {
    this.db.close();
  }

  run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }
}
