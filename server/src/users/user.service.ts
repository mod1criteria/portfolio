import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { User } from './user.interface';
import { CalendarService } from '../calendars/calendar.service';

@Injectable()
export class UserService {
  private filePath = join(__dirname, '..', '..', 'data', 'users.json');

  constructor(private readonly calendarService: CalendarService) {}

  private async readData(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as User[];
    } catch (err: any) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.mkdir(join(__dirname, '..', '..', 'data'), { recursive: true });
        await fs.writeFile(this.filePath, '[]');
        return [];
      }
      throw err;
    }
  }

  private async writeData(data: User[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const data = await this.readData();
    const newUser: User = { id: randomUUID(), ...user };
    data.push(newUser);
    await this.writeData(data);
    await this.calendarService.create({ userId: newUser.id, name: 'default' });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.readData();
  }

  async findOne(id: string): Promise<User | undefined> {
    const data = await this.readData();
    return data.find((u) => u.id === id);
  }

  async update(id: string, update: Partial<User>): Promise<User | undefined> {
    const data = await this.readData();
    const index = data.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    data[index] = { ...data[index], ...update, id };
    await this.writeData(data);
    return data[index];
  }

  async remove(id: string): Promise<boolean> {
    const data = await this.readData();
    const index = data.findIndex((u) => u.id === id);
    if (index === -1) return false;
    data.splice(index, 1);
    await this.writeData(data);
    return true;
  }
}
