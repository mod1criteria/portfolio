import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from './user.interface';
import { CalendarService } from '../calendars/calendar.service';
import { SQLiteService } from '../db/sqlite.service';

@Injectable()
export class UserService {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly db: SQLiteService,
  ) {}

  async create(user: Omit<User, 'id'>): Promise<User> {
    const id = randomUUID();
    await this.db.run(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, [id, user.name, user.email]);
    const newUser: User = { id, ...user };
    await this.calendarService.create({ userId: newUser.id, name: 'default' });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.db.all<User>(`SELECT * FROM users`);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  async update(id: string, update: Partial<User>): Promise<User | undefined> {
    const existing = await this.findOne(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...update };
    await this.db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [merged.name, merged.email, id]);
    return merged;
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) return false;
    await this.db.run(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
}
