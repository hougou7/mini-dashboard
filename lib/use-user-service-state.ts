"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  updateUser as updateUserRequest,
} from "@/lib/user-service";
import { userQueries } from "@/lib/user-queries";
import type { User, UserInput, UserListParams, UserListResponse } from "@/types/user";

export function useUserServiceState(
  initialPage: UserListResponse,
  params: UserListParams,
) {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    ...userQueries.listOptions(params),
    initialData:
      params.page === 1 && params.search === "" ? initialPage : undefined,
  });

  const createMutation = useMutation({
    mutationKey: [...userQueries.all(), "create"],
    mutationFn: createUserRequest,
    onSuccess: async (user: User) => {
      queryClient.setQueryData(userQueries.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationKey: [...userQueries.all(), "update"],
    mutationFn: ({ id, input }: { id: number; input: UserInput }) =>
      updateUserRequest(id, input),
    onSuccess: async (updatedUser: User) => {
      queryClient.setQueryData(userQueries.detail(updatedUser.id), updatedUser);
      await queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationKey: [...userQueries.all(), "delete"],
    mutationFn: deleteUserRequest,
    onSuccess: async (_result: void, id: number) => {
      queryClient.removeQueries({ queryKey: userQueries.detail(id), exact: true });
      await queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });

  function resetMutationErrors() {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  }

  async function createUser(input: UserInput) {
    resetMutationErrors();
    try {
      await createMutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  }

  async function updateUser(id: number, input: UserInput) {
    resetMutationErrors();
    try {
      await updateMutation.mutateAsync({ id, input });
      return true;
    } catch {
      return false;
    }
  }

  async function deleteUser(id: number) {
    resetMutationErrors();
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  return {
    users: usersQuery.data?.items ?? [],
    total: usersQuery.data?.total ?? 0,
    totalUsers: usersQuery.data?.totalUsers ?? 0,
    page: usersQuery.data?.page ?? params.page,
    pageSize: usersQuery.data?.pageSize ?? params.pageSize,
    totalPages: usersQuery.data?.totalPages ?? 1,
    isRefreshing: usersQuery.isFetching,
    isPlaceholderData: usersQuery.isPlaceholderData,
    isMutating:
      createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: mutationError?.message ?? usersQuery.error?.message ?? null,
    refreshUsers: async () => {
      resetMutationErrors();
      await usersQuery.refetch();
    },
    createUser,
    updateUser,
    deleteUser,
  };
}
