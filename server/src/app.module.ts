import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedules/schedule.module';

@Module({
  imports: [ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
