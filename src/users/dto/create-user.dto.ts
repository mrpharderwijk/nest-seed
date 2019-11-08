import { Name } from '../../shared/models/name.model';
import { IsEmail, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: Name;

  @IsEmail()
  readonly emailAddress: string;

  @IsString()
  password: string;

  @IsString()
  passwordConfirm: string;

  @IsBoolean()
  isValidated: boolean;
}
