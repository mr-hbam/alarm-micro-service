import { ObjectId } from 'mongodb';

export const aggregatePagination = (skip: number, limit: number) => [
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
];

export const aggregateLookup = (
  from: string,
  localField: string,
  foreignField: string,
  as: string,
) => {
  return {
    $lookup: {
      from,
      localField,
      foreignField,
      as,
    },
  };
};

// Project aggregation
export const projectArraySize = (key: string) => {
  return {
    $size: { $ifNull: [`$${key}`, []] },
  };
};

export const projectActionBy = (key: string) => {
  return {
    $cond: {
      if: { $size: `$${key}` },
      then: {
        _id: { $arrayElemAt: [`$${key}._id`, 0] },
        firstName: { $arrayElemAt: [`$${key}.firstName`, 0] },
        lastName: { $arrayElemAt: [`$${key}.lastName`, 0] },
      },
      else: false,
    },
  };
};

// Project aggregation

export const projectCreatedAndUpdated = () => {
  return {
    createdBy: projectActionBy('createdBy'),
    updatedBy: projectActionBy('updatedBy'),
    updatedAt: 1,
  };
};

export const optionalProjection = (optionalFields?: string[]) => {
  const fields = {};
  optionalFields?.forEach((field) => {
    fields[field] = 1;
  });

  return fields;
};

// Match aggregation
export const matchKeyWord = (keyWord: string) => {
  return { $regex: `${keyWord.toLowerCase()}.*` };
};

//
export const saveCreatedAtAndUpdatedAt = (userKey: string) => {
  return {
    createdBy: new ObjectId(userKey),
    updatedBy: new ObjectId(userKey),
    updatedAt: new Date(),
  };
};

export const saveUpdatedAt = (userKey: string) => {
  return {
    updatedBy: new ObjectId(userKey),
    updatedAt: new Date(),
  };
};
