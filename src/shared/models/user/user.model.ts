import { Document } from 'mongoose';
import { Name } from '../name.model';

export interface User extends Document {
  name: Name;
  emailAddress: string;
  password: string;
}
