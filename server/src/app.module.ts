import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedules/schedule.module';
import { CalendarModule } from './calendars/calendar.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [ScheduleModule, CalendarModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
