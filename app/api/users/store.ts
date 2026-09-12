import type { User } from "@/components/UserList/UserList";

let users: User[] | null = null;

async function loadUsers(): Promise<User[]> {
  if (users) {
    return users;
  }

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: "no-store",
    });

    users = response.ok ? ((await response.json()) as User[]) : [];
  } catch {
    // CRUD remains available when the optional seed service is unreachable.
    users = [];
  }

  return users;
}

export async function listUsers() {
  return loadUsers();
}

export async function createUser(input: Pick<User, "name" | "email">) {
  const currentUsers = await loadUsers();
  const user: User = {
    id: Math.max(0, ...currentUsers.map((item) => item.id)) + 1,
    ...input,
  };

  users = [...currentUsers, user];
  return user;
}

export async function updateUser(
  id: number,
  input: Pick<User, "name" | "email">,
) {
  const currentUsers = await loadUsers();
  const existingUser = currentUsers.find((user) => user.id === id);

  if (!existingUser) {
    return null;
  }

  const user = { ...existingUser, ...input };
  users = currentUsers.map((item) => (item.id === id ? user : item));
  return user;
}

export async function removeUser(id: number) {
  const currentUsers = await loadUsers();

  if (!currentUsers.some((user) => user.id === id)) {
    return false;
  }

  users = currentUsers.filter((user) => user.id !== id);
  return true;
}
