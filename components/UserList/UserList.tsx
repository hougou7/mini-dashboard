import styles from "./UserList.module.css";

export type User = {
  id: number;
  name: string;
  email: string;
};

type UserListProps = {
  users: User[];
};

export default function UserList({ users }: UserListProps) {
  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li className={styles.item} key={user.id}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  );
}
