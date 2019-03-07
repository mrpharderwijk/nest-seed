import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'nestjs-config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthJwtPayload } from '../shared/models/auth/auth-jwt-payload.model';
import { AuthTokenReply } from '../shared/models/auth/auth-token-reply.model';
import { User } from '../shared/models/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      _id: user._id,
      name: {
        firstName: user.name.firstName,
        middleName: user.name.middleName || null,
        lastName: user.name.lastName,
      },
      emailAddress: user.emailAddress,
    };
  }

  /**
   * Signs the user in by taking the payload and using it to find the user
   * by email address and then comparing the payload password by the user password.
   * When all is fine a token will be created and the normal token reply will be returned.
   * @param payload
   */
  async signIn(payload: AuthJwtPayload): Promise<AuthTokenReply> {
    // Find a user by email address
    const user = await this.userService.findOne(payload.emailAddress);

    // Handle off when no user is found
    if (!user) {
      throw new HttpException(
        'Wrong username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    // Compare the given password to the users password
    const bcryptResult = await bcrypt.compare(payload.password, user.password);

    // Handle off when passwords don't match
    if (!bcryptResult) {
      throw new HttpException(
        'Wrong username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    // Return the token and expirery
    return await this.createToken(user);
  }

  /**
   * Signs the user up
   * @param createUserDto
   */
  async signUp(createUserDto: CreateUserDto): Promise<AuthTokenReply> {
    const user = await this.userService.create(createUserDto);

    // Handle off when the user couldn't be created
    if (!user) {
      throw new HttpException(
        'Something went wrong creating the user',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create and return new token
    return await this.createToken(user);
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
  async validateUser(userId: string): Promise<User> {
    // Find a user by email address
    const user = await this.userService.findOne(userId);

    // Handle off when no user is found
    if (!user) {
      throw new HttpException(
        'Wrong username or password',
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
  async createToken(user: User): Promise<AuthTokenReply> {
    // Create a sign payload which is used to create the token with
    const signPayload = { id: user._id, emailAddress: user.emailAddress };

    // Sign/create the actual token
    const token = await this.jwtService.sign(signPayload);

    // Handle off when token creation fails
    if (!token) {
      throw new HttpException(
        'Wrong username or password',
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
