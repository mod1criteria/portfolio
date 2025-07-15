import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 'user123' })
  userId!: string;

  @ApiProperty({ example: 'calendar123' })
  calendarId!: string;

  @ApiProperty({ example: 'Team meeting' })
  title!: string;

  @ApiProperty({ example: '20231001090000', description: 'YYYYMMDDHHmmss' })
  startDateTime!: string;

  @ApiProperty({ example: '20231001100000', description: 'YYYYMMDDHHmmss' })
  endDateTime!: string;

  @ApiPropertyOptional()
  allDay?: boolean;

  @ApiPropertyOptional({ example: 'Seoul HQ' })
  location?: string;

  @ApiPropertyOptional({ description: 'Alarm object' })
  alarm?: any;

  @ApiPropertyOptional({ example: '#FF5733' })
  color?: string;

  @ApiPropertyOptional()
  isRepeat?: boolean;

  @ApiPropertyOptional({ example: 'repeat123' })
  repeatId?: string;

  @ApiPropertyOptional({ type: [Object] })
  participants?: any[];

  @ApiPropertyOptional({ example: 'Monthly planning meeting' })
  description?: string;
}
