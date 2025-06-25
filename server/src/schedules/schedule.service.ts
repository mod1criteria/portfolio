import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { Schedule } from './schedule.interface';

@Injectable()
export class ScheduleService {
  constructor(private readonly db: DatabaseService) {}

  async create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    const id = randomUUID();
    await this.db.run(
      `INSERT INTO schedules (
        id, userId, calendarId, title, startDateTime, endDateTime, allDay, location, alarm, color, isRepeat, repeatId, participants, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        schedule.userId,
        schedule.calendarId,
        schedule.title,
        schedule.startDateTime,
        schedule.endDateTime,
        schedule.allDay ? 1 : 0,
        schedule.location ?? null,
        schedule.alarm ? JSON.stringify(schedule.alarm) : null,
        schedule.color ?? null,
        schedule.isRepeat ? 1 : 0,
        schedule.repeatId ?? null,
        schedule.participants ? JSON.stringify(schedule.participants) : null,
        schedule.description ?? null,
      ],
    );
    return { id, ...schedule };
  }

  async findAll(userId?: string, calendarId?: string): Promise<Schedule[]> {
    const clauses: string[] = [];
    const params: any[] = [];
    if (userId) {
      clauses.push('userId = ?');
      params.push(userId);
    }
    if (calendarId) {
      clauses.push('calendarId = ?');
      params.push(calendarId);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = await this.db.all<Schedule>(
      `SELECT * FROM schedules ${where}`,
      params,
    );
    return rows;
  }

  async findOne(id: string): Promise<Schedule | undefined> {
    return this.db.get<Schedule>(`SELECT * FROM schedules WHERE id = ?`, [id]);
  }

  async update(
    id: string,
    update: Partial<Schedule>,
  ): Promise<Schedule | undefined> {
    const existing = await this.findOne(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...update } as Schedule;
    await this.db.run(
      `UPDATE schedules SET
        userId = ?,
        calendarId = ?,
        title = ?,
        startDateTime = ?,
        endDateTime = ?,
        allDay = ?,
        location = ?,
        alarm = ?,
        color = ?,
        isRepeat = ?,
        repeatId = ?,
        participants = ?,
        description = ?
      WHERE id = ?`,
      [
        merged.userId,
        merged.calendarId,
        merged.title,
        merged.startDateTime,
        merged.endDateTime,
        merged.allDay ? 1 : 0,
        merged.location ?? null,
        merged.alarm ? JSON.stringify(merged.alarm) : null,
        merged.color ?? null,
        merged.isRepeat ? 1 : 0,
        merged.repeatId ?? null,
        merged.participants ? JSON.stringify(merged.participants) : null,
        merged.description ?? null,
        id,
      ],
    );
    return merged;
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) return false;
    await this.db.run(`DELETE FROM schedules WHERE id = ?`, [id]);
    return true;
  }
}
