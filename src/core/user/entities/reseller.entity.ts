import { UserRole } from '../../user/entities/enum/user-role.entity';

export class ResellerEntity {
  type: UserRole.RESELLER;
  username: string;
  companies: number;
  email: string;
  status: string;
}
