import { AutoMap } from '@automapper/classes';

export interface PaginationType {
  skip?: number;
  limit?: number;
}

export interface KeywordType {
  keyword?: string;
}

export interface DeleteType {
  keys: number;
  limit: number;
}

// Responses
export class CreateAtUpdateAt {
  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  updatedBy?: { key: string; name: string };

  @AutoMap()
  createdBy?: { key: string; name };
}

export class CreateResponse {
  @AutoMap()
  key: string;
}

export class UpdateResponse {
  @AutoMap()
  matchedCount: number;

  @AutoMap()
  modifiedCount: number;

  @AutoMap()
  modified: boolean;
}

export class DeleteResponse {
  @AutoMap()
  deleted: boolean;
}

export class DeletePayload {
  @AutoMap()
  keys: string[];
}
