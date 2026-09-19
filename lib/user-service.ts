import type { User, UserInput } from "@/types/user";

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch {
    throw new Error("Unable to reach the user service");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export function listUsers() {
  return request<User[]>("/api/users", { cache: "no-store" });
}

export function getUser(id: number) {
  return request<User>(`/api/users/${id}`, { cache: "no-store" });
}

export function createUser(input: UserInput) {
  return request<User>("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateUser(id: number, input: UserInput) {
  return request<User>(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteUser(id: number) {
  let response: Response;

  try {
    response = await fetch(`/api/users/${id}`, { method: "DELETE" });
  } catch {
    throw new Error("Unable to reach the user service");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
