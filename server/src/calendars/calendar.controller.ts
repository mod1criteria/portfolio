import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Calendar } from './calendar.interface';
import { CalendarService } from './calendar.service';

@ApiTags('calendars')
@Controller('calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar' })
  @ApiBody({
    description: 'Calendar data',
    examples: {
      default: {
        summary: 'Example calendar',
        value: {
          userId: 'user123',
          name: 'Work',
          color: '#FF0000',
          description: 'Work related events',
        },
      },
    },
  })
  create(@Body() calendar: Omit<Calendar, 'id'>) {
    return this.calendarService.create(calendar);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calendars (optionally by userId)' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter calendars for the given user ID',
    example: 'user123',
  })
  findAll(@Query('userId') userId?: string) {
    return this.calendarService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calendar by id' })
  @ApiParam({ name: 'id', description: 'ID of the calendar', example: '1' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a calendar by id' })
  @ApiParam({ name: 'id', description: 'ID of the calendar', example: '1' })
  @ApiBody({ description: 'Fields to update', examples: { rename: { summary: 'Rename', value: { name: 'Personal' } } } })
  update(@Param('id') id: string, @Body() update: Partial<Calendar>) {
    return this.calendarService.update(id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar by id' })
  @ApiParam({ name: 'id', description: 'ID of the calendar', example: '1' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}
