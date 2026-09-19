"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  updateUser as updateUserRequest,
} from "@/lib/user-service";
import { userQueries } from "@/lib/user-queries";
import type { User, UserInput } from "@/types/user";

export function useUserServiceState(initialUsers: User[]) {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    ...userQueries.listOptions(),
    initialData: initialUsers,
  });

  const createMutation = useMutation({
    mutationKey: [...userQueries.all(), "create"],
    mutationFn: createUserRequest,
    onSuccess: async (user: User) => {
      queryClient.setQueryData<User[]>(userQueries.all(), (users = []) => [...users, user]);
      queryClient.setQueryData(userQueries.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });

  const updateMutation = useMutation({
    mutationKey: [...userQueries.all(), "update"],
    mutationFn: ({ id, input }: { id: number; input: UserInput }) =>
      updateUserRequest(id, input),
    onSuccess: async (updatedUser: User) => {
      queryClient.setQueryData<User[]>(userQueries.all(), (users = []) =>
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      queryClient.setQueryData(userQueries.detail(updatedUser.id), updatedUser);
      await queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });

  const deleteMutation = useMutation({
    mutationKey: [...userQueries.all(), "delete"],
    mutationFn: deleteUserRequest,
    onSuccess: async (_result: void, id: number) => {
      queryClient.setQueryData<User[]>(userQueries.all(), (users = []) =>
        users.filter((user) => user.id !== id),
      );
      queryClient.removeQueries({ queryKey: userQueries.detail(id), exact: true });
      await queryClient.invalidateQueries({ queryKey: userQueries.all() });
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
    users: usersQuery.data,
    isRefreshing: usersQuery.isFetching,
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
