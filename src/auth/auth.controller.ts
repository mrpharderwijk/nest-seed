import {
  Controller,
  Body,
  Post,
  Get,
  UseFilters,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { AuthJwtPayload } from '../shared/models/auth/auth-jwt-payload.model';
import { AuthTokenReply } from '../shared/models/auth/auth-token-reply.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Name } from '../shared/models/name.model';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Retrieves the current user profile
   */
  @Get('profile')
  @UseGuards(AuthGuard())
  @UseFilters(MongoExceptionFilter)
  async findProfile(
    @Request() request: any,
  ): Promise<{
    _id: string;
    name: Name;
    emailAddress: string;
  }> {
    return await this.authService.findProfile(request.user);
  }

  /**
   * Signs a user in
   * @param payload
   */
  @Post('sign-in')
  @UseFilters(MongoExceptionFilter)
  async signIn(@Body() payload: AuthJwtPayload): Promise<AuthTokenReply> {
    return await this.authService.signIn(payload);
  }

  /**
   * Adds a new user
   */
  @Post('sign-up')
  @UseFilters(MongoExceptionFilter)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthTokenReply> {
    return await this.authService.signUp(createUserDto);
  }

  /**
   * Signs a user out
   */
  @Get('sign-out')
  @UseGuards(AuthGuard())
  async signOut(): Promise<string> {
    return await this.authService.signOut();
  }
}
