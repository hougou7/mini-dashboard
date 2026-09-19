export type User = {
  id: number;
  name: string;
  email: string;
};

export type UserInput = Pick<User, "name" | "email">;
