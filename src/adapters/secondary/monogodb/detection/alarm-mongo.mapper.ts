import { createMap, forMember, mapFrom } from '@automapper/core';
import { mapper } from '../../../../common/mappings/mapper';
import { FindAlarmItemResponse, MongoAlarmItem } from './type';

export const initAlarmMapper = () => {
  createMap(
    mapper,
    MongoAlarmItem,
    FindAlarmItemResponse,
    forMember(
      (destination) => destination.key,
      mapFrom((source) => source._id.toString()),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.name),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => source.type),
    ),
    forMember(
      (destination) => destination.description,
      mapFrom((source) => source.description),
    ),
    forMember(
      (destination) => destination.settings,
      mapFrom((source) => source.settings),
    ),
    forMember(
      (destination) => destination.notifications,
      mapFrom((source) => source.notifications),
    ),
    forMember(
      (destination) => destination.schedule,
      mapFrom((source) => source.schedule),
    ),
    forMember(
      (destination) => destination.namespace,
      mapFrom((source) => source.namespace),
    ),
    forMember(
      (destination) => destination.createdAt,
      mapFrom((source) => new Date(source.createdAt)),
    ),
    forMember(
      (destination) => destination.updatedAt,
      mapFrom((source) => new Date(source.updatedAt)),
    ),
    forMember(
      (destination) => destination.unit,
      mapFrom((source) => {
        const unit = source.unit.map((u) => u.key.toString());
        return unit;
      }),
    ),
  );
};
