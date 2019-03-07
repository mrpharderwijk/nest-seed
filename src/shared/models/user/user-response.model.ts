import { Name } from '../name.model';

export interface UserResponse {
  _id: string;
  name: Name;
  emailAddress: string;
}
