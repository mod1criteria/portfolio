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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Schedule } from './schedule.interface';
import { ScheduleService } from './schedule.service';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiBody({
    description: 'Details of the schedule to create',
    examples: {
      default: {
        summary: 'Example schedule',
        value: {
          userId: 'user123',
          calendarId: 'calendar123',
          title: 'Team meeting',
          startDateTime: '20231001090000', // YYYYMMDDHHmmss
          endDateTime: '20231001100000', // YYYYMMDDHHmmss
          location: 'Seoul HQ',
          alarm: {}, // Example alarm object
          color: '#FF5733', // Example hex color code
          isRepeat: false,
          repeatId: null, // No repeat rule
          participants: ['alice@example.com', 'bob@example.com'],
          description: 'Monthly planning meeting',
        },
      },
    },
  })
  create(@Body() schedule: Omit<Schedule, 'id'>) {
    return this.scheduleService.create(schedule);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules (optionally by userId and calendarId)' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter schedules for the given user ID',
    example: 'user123',
  })
  @ApiQuery({
    name: 'calendarId',
    required: false,
    description: 'Filter schedules for the given calendar ID',
    example: 'calendar123',
  })
  findAll(@Query('userId') userId?: string, @Query('calendarId') calendarId?: string) {
    return this.scheduleService.findAll(userId, calendarId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule by id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the schedule to retrieve',
    example: 'a1b2c3',
  })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a schedule by id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the schedule to update',
    example: 'a1b2c3',
  })
  @ApiBody({
    description: 'Partial schedule fields to update',
    examples: {
      updateTitle: {
        summary: 'Update the title and time',
        value: { title: 'Updated meeting', startTime: '10:00' },
      },
    },
  })
  update(@Param('id') id: string, @Body() update: Partial<Schedule>) {
    return this.scheduleService.update(id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule by id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the schedule to delete',
    example: 'a1b2c3',
  })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
