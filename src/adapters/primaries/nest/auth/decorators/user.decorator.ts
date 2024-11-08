import { createParamDecorator, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../../../core/user/entities';
import { UserRequest } from '../../../../../core/common/type';

export interface UserRequestWithOutNamespaceType {
  key: string;
  type: UserRole;
  parent?: string;
}
export const UserRequestWithOutNamespaceDecorator = createParamDecorator(
  (data, req): UserRequestWithOutNamespaceType => {
    const { key, type, parent } = req.args[0].user;
    return {
      key,
      type,
      parent,
    };
  },
);

export const UserRequestDecorator = createParamDecorator(
  (data, req): UserRequest => {
    const { key, type, namespace, parent, username, abilities } =
      req.args?.[0]?.user;
    if (namespace == null) {
      throw new ForbiddenException('');
    }

    return {
      type,
      key,
      namespace,
      parent,
      username,
      abilities: abilities ?? [],
    };
  },
);

export interface UserAuthType {
  key: string;
  username: string;
  namespace?: string;
  '2faEnabled': boolean;
  '2faAuthenticated': boolean;
  type: UserRole;
  parent?: string;
}

export const UserAuthDecorator = createParamDecorator(
  (data, req): UserAuthType => {
    return req.args?.[0]?.user;
  },
);
