/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { User } from './user.interface';
import { CalendarService } from '../calendars/calendar.service';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class UserService {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly db: DatabaseService,
  ) {}

  async create(user: Omit<User, 'id'>): Promise<User> {
    const id = randomUUID();

    const hashed = await bcrypt.hash(user.password, 10);
    await this.db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
      [id, user.name, user.email, hashed],
    );
    const newUser: User = { id, ...user, password: hashed };
    await this.calendarService.create({ userId: newUser.id, name: 'default' });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.db.all<User>(`SELECT * FROM users`);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  async update(id: string, update: Partial<User>): Promise<User | undefined> {
    const existing = await this.findOne(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...update } as User;
    if (update.password) {
      merged.password = await bcrypt.hash(update.password, 10);
    }
    await this.db.run(
      `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
      [merged.name, merged.email, merged.password, id],
    );
    return merged;
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) return false;
    await this.db.run(`DELETE FROM refresh_tokens WHERE userId = ?`, [id]);
    await this.db.run(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
}
