import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CreateAtUpdateAt } from '../../core/common/repository/global.repository';
import { decrypt } from '../cryptography';

export class MongoCreateAtUpdateAt {
  updatedAt: Date;
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export const mapper = createMapper({
  strategyInitializer: classes(),
});

export const MongoCreateAtUpdateAtMapper = createMap(
  mapper,
  MongoCreateAtUpdateAt,
  CreateAtUpdateAt,
  forMember(
    (destination) => destination.updatedBy,
    mapFrom((source) => {
      if (source.updatedBy) {
        const { _id, lastName, firstName } = source.updatedBy;
        return {
          name: `${decrypt(firstName)} ${decrypt(lastName)}`,
          key: _id.toString(),
        };
      }
      return undefined;
    }),
  ),
  forMember(
    (destination) => destination.createdBy,
    mapFrom((source) => {
      if (source.createdBy) {
        const { _id, lastName, firstName } = source.createdBy;
        return {
          name: `${decrypt(firstName)} ${decrypt(lastName)}`,
          key: _id.toString(),
        };
      }
      return undefined;
    }),
  ),
);
