import {
  Controller,
  UseFilters,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { TokenService } from './token.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/confirmation/:tokenId')
  @UseFilters(MongoExceptionFilter)
  async confirmToken(@Param('tokenId') tokenId: string): Promise<any> {
    /**
     * Validate token
     */
    if (!tokenId) {
      throw new HttpException('Incorrect payload', HttpStatus.BAD_REQUEST);
    }

    return await this.tokenService.confirmToken(tokenId);
  }

  @Get('/resend/:userId')
  @UseFilters(MongoExceptionFilter)
  async resendToken(@Param('userId') userId: string): Promise<any> {
    /**
     * Validate input
     */
    if (!userId) {
      throw new HttpException('Incorrect payload', HttpStatus.BAD_REQUEST);
    }

    return await this.tokenService.sendToken(userId);
  }
}
