import { RoleRepository } from '../repositories';
import {
  KeywordType,
  PaginationType,
} from '../../common/repository/global.repository';
import { UserNamespaceFilterPayloadOld } from '../../common/type';

export class GetMembersRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    params: GetMembersRolePayload,
  ): Promise<
    GetMembersRoleResponse & {
      count: number;
    }
  > {
    const [members, count] = await Promise.all([
      this.roleRepository.getMembersRole(params, options),
      this.roleRepository.getMembersRoleCount(params, options),
    ]);

    return {
      list: members.list,
      count,
    };
  }
}

// Types
export interface GetMembersRolePayload extends PaginationType, KeywordType {
  roleKey: string;
}
export interface GetMembersRoleResponse {
  list: {
    firstName: string;
    lastName: string;
    username: string;
    createdAt?: Date;
  }[];
}
