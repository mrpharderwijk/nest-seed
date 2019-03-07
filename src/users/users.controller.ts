import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserResponse } from '../shared/models/user/user-response.model';
import { UserService } from './user.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { User } from '../shared/models/user/user.model';

@Controller('users')
export class UsersController {
  user: UserResponse = null;

  constructor(private readonly userService: UserService) {}

  /**
   * Checks if the user already exists
   * @param user
   */
  @Post('/validate')
  @UseFilters(MongoExceptionFilter)
  async userExists(@Body() user: { emailAddress: string }): Promise<boolean> {
    return await this.userService.userExists(user.emailAddress);
  }

  /**
   * List all users
   */
  @Get()
  @UseGuards(AuthGuard())
  @UseFilters(MongoExceptionFilter)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
