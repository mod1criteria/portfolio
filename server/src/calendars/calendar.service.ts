import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Calendar } from './calendar.interface';

@Injectable()
export class CalendarService {
  private filePath = join(__dirname, '..', '..', 'data', 'calendars.json');

  private async readData(): Promise<Calendar[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as Calendar[];
    } catch (err: any) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.mkdir(join(__dirname, '..', '..', 'data'), { recursive: true });
        await fs.writeFile(this.filePath, '[]');
        return [];
      }
      throw err;
    }
  }

  private async writeData(data: Calendar[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(calendar: Omit<Calendar, 'id'>): Promise<Calendar> {
    const data = await this.readData();
    const newCalendar: Calendar = { id: randomUUID(), ...calendar };
    data.push(newCalendar);
    await this.writeData(data);
    return newCalendar;
  }

  async findAll(userId?: string): Promise<Calendar[]> {
    const data = await this.readData();
    return userId ? data.filter((c) => c.userId === userId) : data;
  }

  async findOne(id: string): Promise<Calendar | undefined> {
    const data = await this.readData();
    return data.find((c) => c.id === id);
  }

  async update(id: string, update: Partial<Calendar>): Promise<Calendar | undefined> {
    const data = await this.readData();
    const index = data.findIndex((c) => c.id === id);
    if (index === -1) {
      return undefined;
    }
    data[index] = { ...data[index], ...update, id };
    await this.writeData(data);
    return data[index];
  }

  async remove(id: string): Promise<boolean> {
    const data = await this.readData();
    const index = data.findIndex((c) => c.id === id);
    if (index === -1) {
      return false;
    }
    data.splice(index, 1);
    await this.writeData(data);
    return true;
  }
}
