import { AutoMap } from '@automapper/classes';

export class MembersRoleItem {
  @AutoMap()
  key: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  username: string;

  @AutoMap()
  addedAt: Date;
}
