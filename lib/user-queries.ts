import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getUser, listUsers } from "@/lib/user-service";
import type { UserListParams } from "@/types/user";

export const userQueries = {
  all: () => ["users"] as const,
  lists: () => [...userQueries.all(), "list"] as const,
  list: (params: UserListParams) => [...userQueries.lists(), params] as const,
  detail: (id: number) => ["users", id] as const,
  listOptions: (params: UserListParams) =>
    queryOptions({
      queryKey: userQueries.list(params),
      queryFn: () => listUsers(params),
      placeholderData: keepPreviousData,
    }),
  detailOptions: (id: number) =>
    queryOptions({ queryKey: userQueries.detail(id), queryFn: () => getUser(id) }),
};
