export type User = {
  id: number;
  name: string;
  email: string;
};

export type UserInput = Pick<User, "name" | "email">;

export const USER_PAGE_SIZE = 10;

export type UserListParams = {
  search: string;
  page: number;
  pageSize: number;
};

export type UserListResponse = {
  items: User[];
  total: number;
  totalUsers: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
