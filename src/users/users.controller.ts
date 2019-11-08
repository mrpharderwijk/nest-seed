import { Controller, UseFilters, Post, Body } from '@nestjs/common';
import { UserResponse } from '../shared/models/user/user-response.model';
import { UserService } from './user.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';

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
}
