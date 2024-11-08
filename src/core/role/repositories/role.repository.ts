import { UserFilter } from '../../entity.interface';
import { RoleEntity } from '../entities';
import { MongoFilterNamespaceOptionsType } from '../../../adapters/secondary/common/type';
import {
  CreateResponse,
  KeywordType,
  PaginationType,
  UpdateResponse,
} from '../../common/repository/global.repository';
import { RoleFilter } from '../../../adapters/primaries/nest/role/dto';
import { RolesItem } from './types/get-roles';
import { RoleMetadata } from './types/role-metadata';
import { MembersRoleItem } from './types/get-members-role';
import { GetRolePermissionsResponse } from './role.repository.type';
import { Permissions } from 'src/core/role/entities/permission.entity';

export interface RoleRepository {
  options: UserFilter;

  getMembersRoleCount(
    params: PaginationType & KeywordType,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<number>;

  updateRolePermissions(
    roleKey: string,
    permissions: Permissions[],
    options: MongoFilterNamespaceOptionsType,
  ): Promise<UpdateResponse>;

  // ####################################
  getRoles(
    params: PaginationType & KeywordType & { filterBy?: RoleFilter },
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ list: RolesItem[] }>;

  createRole(
    role: RoleEntity,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<CreateResponse>;

  getRoleMetadata(
    params: { key: string },
    options: MongoFilterNamespaceOptionsType,
  ): Promise<RoleMetadata>;

  getRolesCount(
    params: KeywordType & { filterBy?: RoleFilter },
    options: MongoFilterNamespaceOptionsType,
  ): Promise<number>;

  getRolePermissions(
    key: string,
    options: MongoFilterNamespaceOptionsType,
  ): Promise<GetRolePermissionsResponse>;

  getMembersRole(
    params: PaginationType & KeywordType & { roleKey: string },
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ list: MembersRoleItem[] }>;

  deleteRoles(
    params: { key: string[] },
    options: MongoFilterNamespaceOptionsType,
  ): Promise<{ deleted: boolean }>;

  addMembersRole(
    roleKey: string,
    members: string[],
    options: MongoFilterNamespaceOptionsType,
  ): Promise<UpdateResponse>;

  removeMembersFromRole(
    roleKey: string,
    members: string[],
    options: MongoFilterNamespaceOptionsType,
  ): Promise<UpdateResponse>;
}
