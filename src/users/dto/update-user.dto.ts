import { Name } from '../../shared/models/name.model';
import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly name: Name;

  @IsEmail()
  readonly emailAddress: string;

  @IsString()
  password: string;

  @IsBoolean()
  isValidated: boolean;
}
