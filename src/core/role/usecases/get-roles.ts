import { RoleRepository } from '../repositories';
import {
  GetListCountReponse,
  UserNamespaceFilterPayloadOld,
} from '../../common/type';
import {
  KeywordType,
  PaginationType,
} from '../../common/repository/global.repository';
import { RoleFilter } from '../../../adapters/primaries/nest/role/dto';

export class GetRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    params: GetRolesPayload,
  ): Promise<GetListRolesResponse & GetListCountReponse> {
    const [{ list }, count] = await Promise.all([
      this.roleRepository.getRoles(params, options),
      this.roleRepository.getRolesCount(params, options),
    ]);

    return {
      list,
      count,
    };
  }
}

//---------- Types ----------//
export class GetRolesPayload implements PaginationType, KeywordType {
  limit: number;
  skip: number;
  keyword?: string;
  filterBy?: RoleFilter;
}

export class GetListRolesResponse {
  list: {
    key: string;
    name: string;
    members: number;
    updatedAt: Date;
    updatedBy?: { key: string; name: string };
    createdBy?: { key: string; name: string };
  }[];
}
