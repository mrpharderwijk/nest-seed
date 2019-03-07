import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../shared/models/user/user.model';
import { CreateUserDto } from './dto/create-user.dto';

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
    const userExists = await this.findOne(emailAddress);

    return !!userExists;
  }

  /**
   * Encrypts the password of the user and tries to save the new user
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);

    const createUser = new this.userModel(createUserDto);
    return await createUser.save();
  }

  /**
   * Find a user by emailAddress
   * @param emailAddress
   */
  async findOne(emailAddress: string): Promise<User> {
    return await this.userModel.findOne({ emailAddress }).exec();
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
  async updateOne(user: User): Promise<User> {
    return await this.userModel
      .updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            ...user,
          },
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
