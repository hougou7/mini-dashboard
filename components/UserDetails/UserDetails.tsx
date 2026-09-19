"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { userQueries } from "@/lib/user-queries";
import type { User } from "@/types/user";

import styles from "./UserDetails.module.css";

type UserDetailsProps = { initialUser: User; userId: number };

export default function UserDetails({ initialUser, userId }: UserDetailsProps) {
  const { data: user, error, isFetching } = useQuery({
    ...userQueries.detailOptions(userId),
    initialData: initialUser,
  });

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} href="/dashboard/users">← All users</Link>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>User {userId}</p>
          <h1>{user.name}</h1>
        </div>
        <code>queryKey: [&quot;users&quot;, {userId}]</code>
      </div>
      {error && <p className={styles.error} role="alert">{error.message}</p>}
      <dl className={styles.details} aria-busy={isFetching}>
        <div><dt>ID</dt><dd>{user.id}</dd></div>
        <div><dt>Name</dt><dd>{user.name}</dd></div>
        <div><dt>Email</dt><dd><a href={`mailto:${user.email}`}>{user.email}</a></dd></div>
      </dl>
      {isFetching && <p className={styles.refreshing}>Refreshing user…</p>}
    </div>
  );
}
