import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { Calendar } from './calendar.interface';

@Injectable()
export class CalendarService {
  constructor(private readonly db: DatabaseService) {}

  async create(calendar: Omit<Calendar, 'id'>): Promise<Calendar> {
    const id = randomUUID();
    await this.db.run(
      `INSERT INTO calendars (id, userId, name, color, description) VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        calendar.userId,
        calendar.name,
        calendar.color ?? null,
        calendar.description ?? null,
      ],
    );
    return { id, ...calendar };
  }

  async findAll(userId?: string): Promise<Calendar[]> {
    if (userId) {
      return this.db.all<Calendar>(`SELECT * FROM calendars WHERE userId = ?`, [
        userId,
      ]);
    }
    return this.db.all<Calendar>(`SELECT * FROM calendars`);
  }

  async findOne(id: string): Promise<Calendar | undefined> {
    return this.db.get<Calendar>(`SELECT * FROM calendars WHERE id = ?`, [id]);
  }

  async update(
    id: string,
    update: Partial<Calendar>,
  ): Promise<Calendar | undefined> {
    const existing = await this.findOne(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...update };
    await this.db.run(
      `UPDATE calendars SET userId = ?, name = ?, color = ?, description = ? WHERE id = ?`,
      [
        merged.userId,
        merged.name,
        merged.color ?? null,
        merged.description ?? null,
        id,
      ],
    );
    return merged;
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) return false;
    await this.db.run(`DELETE FROM calendars WHERE id = ?`, [id]);
    return true;
  }
}
