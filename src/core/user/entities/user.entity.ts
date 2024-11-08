import { Language, TimeZone } from '../../common/type';
import { UserRole } from './enum/user-role.entity';

export class UserEntity {
  status: 'waiting' | 'active';
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  timezone: TimeZone;
  language: Language;
  type: UserRole;
  isLockedOut?: boolean;
  namespace?: string;
  phone?: string;
  email?: string;
  abilities?: string[];
  '2faEnabled'?: boolean;
  '2faAuthenticated'?: boolean;
}
