import { Name } from '../../shared/models/name.model';
import { IsEmail, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  readonly name: Name;

  @IsEmail()
  readonly emailAddress: string;

  @IsString()
  password: string;

  @IsBoolean()
  isValidated: boolean;
}
