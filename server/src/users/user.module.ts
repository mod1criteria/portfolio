import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CalendarModule } from '../calendars/calendar.module';
import { SQLiteModule } from '../db/sqlite.module';

@Module({
  imports: [CalendarModule, SQLiteModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
