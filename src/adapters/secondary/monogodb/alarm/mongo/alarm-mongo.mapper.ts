import { createMap, extend, forMember, mapFrom } from '@automapper/core';
import {
  mapper,
  MongoCreateAtUpdateAtMapper,
} from '../../../../../common/mappings/mapper';
import { MongoAlarmItem } from './type';
import { AlarmEntity } from '../../../../../core/alarm/entities/alarm.entity';

export const initAlarmMapper = () => {
  MongoFetchAlarmItemToFetchAlarmItemResponse();
};
const MongoFetchAlarmItemToFetchAlarmItemResponse = () => {
  createMap(
    mapper,
    MongoAlarmItem,
    AlarmEntity,
    forMember(
      (destination) => destination.key,
      mapFrom((source) => source._id.toString()),
    ),
    forMember(
      (destination) => destination.type,
      mapFrom((source) => source.type),
    ),
    forMember(
      (destination) => destination.name,
      mapFrom((source) => source.name),
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
    extend(MongoCreateAtUpdateAtMapper),
  );
};
