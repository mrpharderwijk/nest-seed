import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Model } from 'mongoose';
import { Token } from '../shared/models/token.model';
import { CreateTokenDto } from './dto/create-token.dto';
import { UserService } from '../users/user.service';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TokenModelToken') private readonly tokenModel: Model<Token>,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a random token and converts it to a string
   * @param bytes
   * @param type
   */
  generate(bytes = 16, type = 'hex') {
    return crypto.randomBytes(bytes).toString(type);
  }

  /**
   * Creates a token connected to a userId
   * @param createUserDto
   */
  async create(userId: string): Promise<Token> {
    if (!userId) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    const createTokenDto: CreateTokenDto = {
      userId,
      token: this.generate(),
    };

    const createToken = new this.tokenModel(createTokenDto);
    return await createToken.save();
  }

  /**
   * Confirm a token by tokenId
   * @param tokenId
   */
  async confirmToken(tokenId: string) {
    if (!tokenId) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    /**
     * Find the token in the db by tokenId
     */
    const token = await this.findOne(tokenId);
    if (!token) {
      throw new HttpException(
        'TOKEN_CONFIRMATION_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }

    /**
     * With the found token, find the user and update the isValidated value
     */
    const user = await this.userService.findOne(token.userId);
    if (!user || user.isValidated) {
      throw new HttpException(
        'TOKEN_CONFIRMATION_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateModel = {
      isValidated: true,
    };
    const updatedUser = this.userService.updateOne(user, updateModel);

    if (!updatedUser) {
      throw new HttpException(
        'TOKEN_CONFIRMATION_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }

    /**
     * Remove token after update is successfull
     */
    const removeTokenRecord = this.removeOne(token);
    if (!removeTokenRecord) {
      throw new HttpException(
        'TOKEN_CONFIRMATION_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      statusCode: 200,
      message: 'TOKEN_CONFIRMATION_SUCCESS',
    };
  }

  /**
   * (re)Sends a token to a user
   * @param createUserDto
   */
  async sendToken(userId: string) {
    if (!userId) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }
    const config = this.configService.get('mail');
    const tokenFound = await this.findOneByUserId(userId);
    const generatedToken = this.generate();

    const tokenRecord = tokenFound
      ? await this.updateOne(tokenFound, generatedToken)
      : await this.create(userId);

    const transporter = nodemailer.createTransport({
      host: config.smtp.server,
      port: Number(config.smtp.port),
      secure: config.smtp.secure === 'true', // upgrade later with STARTTLS
      auth: {
        user: config.auth.username,
        pass: config.auth.password,
      },
    });

    /**
     * TODO: html should become an external html template, and
     * confirmation url should become environment dependend
     */
    const mailOptions = {
      from: config.mailer.from,
      to: 'mrpharderwijk@gmail.com',
      subject: 'Sending Email using Node.js',
      html:
        '<html>' +
        '<head>' +
        '</head>' +
        '<body>' +
        `That was easy! <a href="https://bla.herokuapp.com/confirmation/${
          tokenRecord.token
        }">verify email</a>.<br>` +
        `Confirmation token: ${tokenRecord.token}<br>` +
        `UserId: ${tokenRecord.userId}` +
        '<body>' +
        '</html>',
    };

    const sendMail = await transporter.sendMail(mailOptions);

    if (!sendMail) {
      throw new HttpException(
        'AUTH_VALIDATION_MAIL_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }

    return sendMail;
  }

  /**
   * Find a token by userId
   * @param userId
   */
  async findOneByUserId(userId: string): Promise<Token> {
    if (!userId) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await this.tokenModel.findOne({ userId }).exec();
  }

  /**
   * Find a token by tokenId
   * @param tokenId
   */
  async findOne(tokenId: string) {
    if (!tokenId) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await this.tokenModel.findOne({ token: tokenId }).exec();
  }

  /**
   * Update a token
   * @param userId
   */
  async updateOne(oldToken: Token, newToken: string): Promise<Token> {
    if (!oldToken || !newToken) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await this.tokenModel
      .updateOne(
        {
          _id: oldToken._id,
        },
        {
          $set: {
            token: newToken,
          },
        },
      )
      .exec();
  }

  async removeOne(token: Token) {
    if (!token) {
      throw new HttpException('TOKEN_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }
    return await this.tokenModel.deleteOne({ _id: token._id });
  }
}
