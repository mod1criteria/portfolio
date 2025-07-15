import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalendarDto {
  @ApiProperty({ example: 'user123' })
  userId!: string;

  @ApiProperty({ example: 'Work' })
  name!: string;

  @ApiPropertyOptional({ example: '#FF0000' })
  color?: string;

  @ApiPropertyOptional({ example: 'Work related events' })
  description?: string;
}
