import { queryOptions } from "@tanstack/react-query";

import { getUser, listUsers } from "@/lib/user-service";

export const userQueries = {
  all: () => ["users"] as const,
  detail: (id: number) => ["users", id] as const,
  listOptions: () => queryOptions({ queryKey: userQueries.all(), queryFn: listUsers }),
  detailOptions: (id: number) =>
    queryOptions({ queryKey: userQueries.detail(id), queryFn: () => getUser(id) }),
};
