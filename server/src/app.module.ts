import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedules/schedule.module';
import { CalendarModule } from './calendars/calendar.module';
import { UserModule } from './users/user.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule,
    CalendarModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
