import { IsString } from 'class-validator';

export class NameDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;
}
