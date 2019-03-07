import { Name } from '../../shared/models/name.model';

export class CreateUserDto {
  readonly name: Name;
  readonly emailAddress: string;
  password: string;
}
