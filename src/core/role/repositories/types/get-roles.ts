import { CreateAtUpdateAt } from '../../../common/repository/global.repository';
import { AutoMap } from '@automapper/classes';

export class RolesItem extends CreateAtUpdateAt {
  @AutoMap()
  key: string;

  @AutoMap()
  name: string;

  @AutoMap()
  members: number;
}
