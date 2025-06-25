import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CalendarModule } from '../calendars/calendar.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [CalendarModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
