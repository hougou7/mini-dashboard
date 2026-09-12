"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";

import type { User } from "@/components/UserList/UserList";

type UserState = {
  users: User[];
  isRefreshing: boolean;
  isMutating: boolean;
  error: string | null;
};

type UserInput = Pick<User, "name" | "email">;

type UserAction =
  | { type: "userAdded"; user: User }
  | { type: "userUpdated"; user: User }
  | { type: "userDeleted"; id: number }
  | { type: "refreshStarted" }
  | { type: "refreshSucceeded"; users: User[] }
  | { type: "refreshFailed"; error: string }
  | { type: "mutationStarted" }
  | { type: "mutationFinished" }
  | { type: "mutationFailed"; error: string };

type UserContextValue = {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  refreshUsers: () => Promise<void>;
  createUser: (input: UserInput) => Promise<boolean>;
  updateUser: (id: number, input: UserInput) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "userAdded":
      return { ...state, users: [...state.users, action.user], error: null };
    case "userUpdated":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.user.id ? action.user : user,
        ),
        error: null,
      };
    case "userDeleted":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.id),
        error: null,
      };
    case "refreshStarted":
      return { ...state, isRefreshing: true, error: null };
    case "refreshSucceeded":
      return { ...state, users: action.users, isRefreshing: false, error: null };
    case "refreshFailed":
      return { ...state, isRefreshing: false, error: action.error };
    case "mutationStarted":
      return { ...state, isMutating: true, error: null };
    case "mutationFinished":
      return { ...state, isMutating: false, error: null };
    case "mutationFailed":
      return { ...state, isMutating: false, error: action.error };
    default:
      return state;
  }
}

export function UserProvider({
  initialUsers,
  children,
}: {
  initialUsers: User[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(userReducer, {
    users: initialUsers,
    isRefreshing: false,
    isMutating: false,
    error: null,
  });
  const isRefreshInProgress = useRef(false);

  const getErrorMessage = useCallback(async (response: Response) => {
    try {
      const body = (await response.json()) as { error?: string };
      return body.error ?? "Something went wrong";
    } catch {
      return "Something went wrong";
    }
  }, []);

  const mutateUsers = useCallback(
    async (
      request: () => Promise<Response>,
      onSuccess: (user: User) => void,
    ) => {
      dispatch({ type: "mutationStarted" });

      try {
        const response = await request();
        if (!response.ok) {
          dispatch({ type: "mutationFailed", error: await getErrorMessage(response) });
          return false;
        }

        onSuccess((await response.json()) as User);
        dispatch({ type: "mutationFinished" });
        return true;
      } catch {
        dispatch({ type: "mutationFailed", error: "Unable to reach the user service" });
        return false;
      }
    },
    [getErrorMessage],
  );

  const refreshUsers = useCallback(async () => {
    if (isRefreshInProgress.current) return;

    isRefreshInProgress.current = true;
    dispatch({ type: "refreshStarted" });

    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) {
        dispatch({ type: "refreshFailed", error: await getErrorMessage(response) });
        return;
      }

      const users = (await response.json()) as User[];
      dispatch({ type: "refreshSucceeded", users });
    } catch {
      dispatch({ type: "refreshFailed", error: "Unable to reach the user service" });
    } finally {
      isRefreshInProgress.current = false;
    }
  }, [getErrorMessage]);

  const createUser = useCallback(
    (input: UserInput) =>
      mutateUsers(
        () =>
          fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }),
        (user) => dispatch({ type: "userAdded", user }),
      ),
    [mutateUsers],
  );

  const updateUser = useCallback(
    (id: number, input: UserInput) =>
      mutateUsers(
        () =>
          fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }),
        (user) => dispatch({ type: "userUpdated", user }),
      ),
    [mutateUsers],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      dispatch({ type: "mutationStarted" });

      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) {
          dispatch({ type: "mutationFailed", error: await getErrorMessage(response) });
          return false;
        }

        dispatch({ type: "userDeleted", id });
        dispatch({ type: "mutationFinished" });
        return true;
      } catch {
        dispatch({ type: "mutationFailed", error: "Unable to reach the user service" });
        return false;
      }
    },
    [getErrorMessage],
  );

  return (
    <UserContext.Provider
      value={{ state, dispatch, refreshUsers, createUser, updateUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUsers must be used inside a UserProvider");
  }

  return context;
}
