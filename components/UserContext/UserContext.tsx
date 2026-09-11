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
};

type UserAction =
  | { type: "userAdded"; user: User }
  | { type: "userDeleted"; id: number }
  | { type: "refreshStarted" }
  | { type: "refreshSucceeded"; users: User[] }
  | { type: "refreshFailed" };

type UserContextValue = {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  refreshUsers: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "userAdded":
      return { ...state, users: [...state.users, action.user] };
    case "userDeleted":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.id),
      };
    case "refreshStarted":
      return { ...state, isRefreshing: true };
    case "refreshSucceeded":
      return { users: action.users, isRefreshing: false };
    case "refreshFailed":
      return { ...state, isRefreshing: false };
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
  });
  const isRefreshInProgress = useRef(false);

  const refreshUsers = useCallback(async () => {
    if (isRefreshInProgress.current) return;

    isRefreshInProgress.current = true;
    dispatch({ type: "refreshStarted" });

    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) {
        dispatch({ type: "refreshFailed" });
        return;
      }

      const users = (await response.json()) as User[];
      dispatch({ type: "refreshSucceeded", users });
    } catch {
      dispatch({ type: "refreshFailed" });
    } finally {
      isRefreshInProgress.current = false;
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch, refreshUsers }}>
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
