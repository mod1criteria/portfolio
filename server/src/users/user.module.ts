import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CalendarModule } from '../calendars/calendar.module';

@Module({
  imports: [CalendarModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
