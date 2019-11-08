import { NameDto } from './name.dto';
import { IsEmail, IsString, IsObject } from 'class-validator';

export class RegisterUserDto {
  @IsObject()
  name: NameDto;

  @IsEmail()
  emailAddress: string;

  @IsString()
  password: string;

  @IsString()
  passwordConfirm: string;
}
