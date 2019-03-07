import { Name } from '../name.model';

export interface AuthJwtReply {
  _id: string;
  name: Name;
  emailAddress: string;
}
