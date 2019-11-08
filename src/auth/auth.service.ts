import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'nestjs-config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthJwtPayload } from '../shared/models/auth/auth-jwt-payload.model';
import { AuthTokenReply } from '../shared/models/auth/auth-token-reply.model';
import { User } from '../shared/models/user/user.model';
import { TokenService } from '../tokens/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  /**
   * Validates a user by its id
   * @param payload
   */
  async findProfile(payload: AuthJwtPayload) {
    const user = await this.validateUser(payload.emailAddress);

    if (!user) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }

    return {
      name: {
        firstName: user.name.firstName,
        middleName: user.name.middleName || null,
        lastName: user.name.lastName,
      },
      emailAddress: user.emailAddress,
      isValidated: user.isValidated,
    };
  }

  /**
   * Log in the user by taking the payload and using it to find the user
   * by email address and then comparing the payload password by the user password.
   * When all is fine a token will be created and the normal token reply will be returned.
   * @param payload
   */
  async logIn(payload: AuthJwtPayload): Promise<any> {
    // Find a user by email address
    const user = await this.userService.findOneByEmailAddress(
      payload.emailAddress.toLowerCase(),
    );

    // Handle off when no user is found
    if (!user) {
      throw new HttpException('AUTH_CREDENTIALS_ERROR', HttpStatus.FORBIDDEN);
    }

    // Compare the given password to the users password
    const bcryptResult = await bcrypt.compare(payload.password, user.password);

    // Handle off when passwords don't match
    if (!bcryptResult) {
      throw new HttpException('AUTH_CREDENTIALS_ERROR', HttpStatus.FORBIDDEN);
    }

    // Return the token and expirery
    return await this.createAccessToken(user);
  }

  /**
   * Register the user up
   * @param createUserDto
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.create(createUserDto);

    // Handle off when the user couldn't be created
    if (!user) {
      throw new HttpException('USER_CREATION_ERROR', HttpStatus.BAD_REQUEST);
    }

    const sendToken = this.tokenService.sendToken(user.id);
    if (!sendToken) {
      throw new HttpException('USER_CREATION_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await this.createAccessToken(user);
  }

  /**
   * JWT can't actually remove tokens or remove sessions, it is only removed from
   * the client storage
   */
  signOut(): string {
    return 'Token deleted...';
  }

  /**
   * Uses the JwtPayload's email address to check if it exists in the database
   * and return the complete user when found
   * @param payload
   */
  async validateUser(emailAddress: string): Promise<User> {
    // Find a user by email address
    const user = await this.userService.findOneByEmailAddress(emailAddress);

    // Handle off when no user is found
    if (!user) {
      throw new HttpException(
        'AUTH_CREDENTIALS_ERROR',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Return the user
    return user;
  }

  /**
   * Creates a JWT token and returns the token and the expirery to the user
   * @param user
   */
  async createAccessToken(user: User): Promise<AuthTokenReply> {
    // Create a sign payload which is used to create the token with
    const signPayload = { id: user._id, emailAddress: user.emailAddress };

    // Sign/create the actual token
    const token = await this.jwtService.sign(signPayload);

    // Handle off when token creation fails
    if (!token) {
      throw new HttpException(
        'AUTH_CREDENTIALS_ERROR',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Return the token information
    return {
      expiresIn: Number(this.configService.get('jwt').expiresIn),
      accessToken: token,
    };
  }
}
