import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Schedule } from './schedule.interface';

@Injectable()
export class ScheduleService {
  private filePath = join(__dirname, '..', '..', 'data', 'schedules.json');

  private async readData(): Promise<Schedule[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as Schedule[];
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(join(__dirname, '..', '..', 'data'), { recursive: true });
        await fs.writeFile(this.filePath, '[]');
        return [];
      }
      throw err;
    }
  }

  private async writeData(data: Schedule[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    const data = await this.readData();
    const newSchedule: Schedule = { id: randomUUID(), ...schedule };
    data.push(newSchedule);
    await this.writeData(data);
    return newSchedule;
  }

  async findAll(userId?: string): Promise<Schedule[]> {
    const data = await this.readData();
    return userId ? data.filter((s) => s.userId === userId) : data;
  }

  async findOne(id: string): Promise<Schedule | undefined> {
    const data = await this.readData();
    return data.find((s) => s.id === id);
  }

  async update(id: string, update: Partial<Schedule>): Promise<Schedule | undefined> {
    const data = await this.readData();
    const index = data.findIndex((s) => s.id === id);
    if (index === -1) {
      return undefined;
    }
    data[index] = { ...data[index], ...update, id };
    await this.writeData(data);
    return data[index];
  }

  async remove(id: string): Promise<boolean> {
    const data = await this.readData();
    const index = data.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }
    data.splice(index, 1);
    await this.writeData(data);
    return true;
  }
}
