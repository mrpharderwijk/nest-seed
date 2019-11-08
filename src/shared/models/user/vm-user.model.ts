import { Name } from '../name.model';
export interface VmUser {
  name: Name;
  emailAddress: string;
  isValidated: boolean;
}
