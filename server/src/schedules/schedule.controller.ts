import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Schedule } from './schedule.interface';
import { ScheduleService } from './schedule.service';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  create(@Body() schedule: Omit<Schedule, 'id'>) {
    return this.scheduleService.create(schedule);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules (optionally by userId)' })
  findAll(@Query('userId') userId?: string) {
    return this.scheduleService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule by id' })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a schedule by id' })
  update(@Param('id') id: string, @Body() update: Partial<Schedule>) {
    return this.scheduleService.update(id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule by id' })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
