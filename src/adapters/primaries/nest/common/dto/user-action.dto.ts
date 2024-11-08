export interface CreateAtUpdateAtDto {
  updatedAt: Date;
  updatedBy?: { key: string; name: string };
  createdBy?: { key: string; name: string };
}
