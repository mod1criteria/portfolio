import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Schedule } from './schedule.interface';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() schedule: Omit<Schedule, 'id'>) {
    return this.scheduleService.create(schedule);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.scheduleService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() update: Partial<Schedule>) {
    return this.scheduleService.update(id, update);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
