import {
  Controller,
  Body,
  Post,
  Get,
  UseFilters,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { AuthJwtPayload } from '../shared/models/auth/auth-jwt-payload.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JoiValidationPipe } from '../shared/pipes/joi-validation.pipe';
import { UserSchema } from '../users/schemas/user.schema';
import { VmUser } from '../shared/models/user/vm-user.model';
import { AuthTokenReply } from '../shared/models/auth/auth-token-reply.model';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Retrieves the current user profile
   */
  @Get('profile')
  @UseGuards(AuthGuard())
  @UseFilters(MongoExceptionFilter)
  async findProfile(@Request() request: any): Promise<VmUser> {
    return await this.authService.findProfile(request.user);
  }

  /**
   * Signs a user in
   * @param payload
   */
  @Post('log-in')
  @UseFilters(MongoExceptionFilter)
  async logIn(@Body() payload: AuthJwtPayload): Promise<AuthTokenReply> {
    return await this.authService.logIn(payload);
  }

  /**
   * Adds a new user
   */
  @Post('register')
  @UsePipes(new JoiValidationPipe(UserSchema))
  @UseFilters(MongoExceptionFilter)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthTokenReply> {
    return await this.authService.register(createUserDto);
  }

  /**
   * Signs a user out
   */
  @Get('sign-out')
  @UseGuards(AuthGuard())
  signOut(): string {
    return this.authService.signOut();
  }
}
