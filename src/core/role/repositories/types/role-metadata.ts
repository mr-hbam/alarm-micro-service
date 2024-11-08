import { AutoMap } from '@automapper/classes';

export class RoleMetadata {
  @AutoMap()
  name: string;

  @AutoMap()
  members: number;
}
