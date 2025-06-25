import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './user.interface';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (with default calendar)' })
  @ApiBody({
    description: 'User data',
    examples: {
      default: {
        summary: 'Example user',
        value: {
          name: 'Alice',
          email: 'alice@example.com',
        },
      },
    },
  })
  create(@Body() user: Omit<User, 'id'>) {
    return this.userService.create(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: '1' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: '1' })
  @ApiBody({ description: 'Fields to update', examples: { rename: { summary: 'Rename', value: { name: 'Bob' } } } })
  update(@Param('id') id: string, @Body() update: Partial<User>) {
    return this.userService.update(id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: '1' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
