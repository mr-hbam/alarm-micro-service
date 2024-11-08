import { MongoCollections } from '../../adapters/secondary/common/mongodb/collections';

const INDEXES = {
  [MongoCollections.USER]: [
    {
      key: { username: 1 },
      name: 'username_1',
      unique: true,
    },
  ],
  [MongoCollections.DEVICE]: [
    {
      key: { imei: 1 },
      name: 'imei_1',
      unique: true,
    },
  ],
  [MongoCollections.HISTORY]: [
    {
      key: { unit: 1, start: 1, end: 1 },
      name: 'unit_1',
    },
  ],
  [MongoCollections.STOP]: [
    {
      key: { name: 1 },
      name: 'name_1',
    },
  ],
  [MongoCollections.OPERATOR_ASSIGNMENT]: [
    {
      key: { start: 1, end: 1, unit: 1 },
      name: 'start_1_end_1_unit_1',
    },
  ],
};

export default INDEXES;
