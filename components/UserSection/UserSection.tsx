"use client";

import { useState } from "react";

import UserList, { type User } from "@/components/UserList/UserList";
import UserManager from "@/components/UserManager/UserManager";

import styles from "./UserSection.module.css";

type UserSectionProps = {
  initialUsers: User[];
};

export default function UserSection({ initialUsers }: UserSectionProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  return (
    <>
      <section>
        <h2 className={styles.heading}>User Manager</h2>
        <UserManager initialUsers={users} onUsersChange={setUsers} />
      </section>

      <section className={styles.listSection}>
        <h2 className={styles.heading}>User List</h2>
        <UserList users={users} />
      </section>
    </>
  );
}
