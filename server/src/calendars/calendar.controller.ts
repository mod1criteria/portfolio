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
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { CalendarService } from './calendar.service';

@ApiTags('calendars')
@Controller('calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar' })
  @ApiBody({ type: CreateCalendarDto })
  create(@Body() calendar: CreateCalendarDto) {
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
  @ApiBody({ type: UpdateCalendarDto })
  update(@Param('id') id: string, @Body() update: UpdateCalendarDto) {
    return this.calendarService.update(id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar by id' })
  @ApiParam({ name: 'id', description: 'ID of the calendar', example: '1' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}
