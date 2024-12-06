import { createMap, extend, forMember, mapFrom } from '@automapper/core';
import { AlarmTypeEntity } from '../../../../../core/alarm/entities/type.entity';
import {
  mapper,
  MongoCreateAtUpdateAtMapper,
} from '../../../../../common/mappings/mapper';
import { MongoAlarmTypeItem } from './type';

export const initAlarmTypeMapper = () =>
  createMap(
    mapper,
    MongoAlarmTypeItem,
    AlarmTypeEntity,
    forMember(
      (destination) => destination.key,
      mapFrom((source) => source._id.toString()),
    ),
    forMember(
      (destination) => destination.label,
      mapFrom((source) => source.label),
    ),
    forMember(
      (destination) => destination.value,
      mapFrom((source) => source.value),
    ),
    forMember(
      (destination) => destination.settings,
      mapFrom((source) => source.settings),
    ),
    forMember(
      (destination) => destination.notifications,
      mapFrom((source) => source.notifications),
    ),
    extend(MongoCreateAtUpdateAtMapper),
  );
