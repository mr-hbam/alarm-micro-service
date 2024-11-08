export interface GetRolePermissionsResponse {
  permissions: string[];
}

export interface GetMembersRoleResponse {
  list: {
    firstName: string;
    lastName: string;
    username: string;
  }[];
}
