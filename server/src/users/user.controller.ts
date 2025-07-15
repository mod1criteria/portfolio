import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user (with default calendar)' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() user: CreateUserDto) {
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
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() update: UpdateUserDto) {
    return this.userService.update(id, update);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password by email' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) return undefined;
    return this.userService.update(user.id, { password: body.password });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: '1' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
