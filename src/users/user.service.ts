import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../shared/models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

const SALT_WORK_FACTOR = 10;

@Injectable()
export class UserService {
  constructor(
    @Inject('UserModelToken') private readonly userModel: Model<User>,
  ) {}

  /**
   * Checks if a user with the given emailAddress already exists in the database
   * @param emailAddress
   */
  async userExists(emailAddress: string): Promise<boolean> {
    if (!emailAddress) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }
    emailAddress = emailAddress.toLowerCase();

    const userExists = await this.findOneByEmailAddress(emailAddress);

    return !!userExists;
  }

  /**
   * Encrypts the password of the user and tries to save the new user
   * @param createUserDto
   */
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    if (!registerUserDto) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }
    registerUserDto.password = await this.encryptPassword(
      registerUserDto.password,
    );

    /**
     * Check if user already exists
     */
    const userExists = await this.userExists(registerUserDto.emailAddress);
    if (userExists) {
      throw new HttpException('USER_EXISTS_ERROR', HttpStatus.BAD_REQUEST);
    }
    const createUserDto = { isValidated: false, ...registerUserDto };
    const createUser = new this.userModel(createUserDto);
    const userCreated = await createUser.save();

    if (!userCreated) {
      throw new HttpException('USER_CREATE_ERROR', HttpStatus.BAD_REQUEST);
    }

    return userCreated;
  }

  /**
   * Find a user by emailAddress
   * @param emailAddress
   */
  async findOneByEmailAddress(emailAddress: string): Promise<User> {
    if (!emailAddress) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    emailAddress = emailAddress.toLowerCase();

    return await this.userModel.findOne({ emailAddress }).exec();
  }

  /**
   * Find a user by userId
   * @param userId
   */
  async findOne(userId: string): Promise<User> {
    if (!userId) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await this.userModel.findOne({ _id: userId }).exec();
  }

  /**
   * Returns all users in the database
   */
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  /**
   * Update a user by userId
   * @param user
   */
  async updateOne(user: User, updatedModel: any): Promise<User> {
    if (!updatedModel) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    const newModel = { ...user, ...updatedModel };

    return await this.userModel
      .updateOne(
        {
          _id: user._id,
        },
        {
          $set: newModel,
        },
      )
      .exec();
  }

  /**
   * Encrypts the password of a user
   * @param password
   * TODO: return value
   */
  async encryptPassword(password: string): Promise<any> {
    if (!password) {
      throw new HttpException('USER_PAYLOAD_ERROR', HttpStatus.BAD_REQUEST);
    }

    return await bcrypt
      .hash(password, SALT_WORK_FACTOR)
      .then((hashErr, hash) => {
        if (hashErr) {
          return hashErr;
        }

        password = hash;
      });
  }
}
