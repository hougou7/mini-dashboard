"use client";

import { useMemo, useState } from "react";

import UserList, { type User } from "@/components/UserList/UserList";
import { UserProvider, useUsers } from "@/components/UserContext/UserContext";
import UserManager from "@/components/UserManager/UserManager";

import styles from "./UserSection.module.css";

type UserSectionProps = {
  initialUsers: User[];
};

export default function UserSection({ initialUsers }: UserSectionProps) {
  return (
    <UserProvider initialUsers={initialUsers}>
      <UserSectionContent />
    </UserProvider>
  );
}

function UserSectionContent() {
  const { state } = useUsers();
  const { users } = state;
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim();

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalizedSearchQuery.toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedSearchQuery, users]);

  return (
    <>
      <section>
        <h2 className={styles.heading}>User Manager</h2>
        <UserManager hideUserList />
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2 className={styles.heading}>User List</h2>
          <div className={styles.searchBox}>
            <label htmlFor="user-search">Search users</label>
            <div className={styles.searchInputWrap}>
              <span aria-hidden="true" className={styles.searchIcon}>⌕</span>
              <input
                id="user-search"
                type="search"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearButton}
                  aria-label="Clear user search"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {normalizedSearchQuery
            ? `${filteredUsers.length} of ${users.length} users found`
            : "Search by name or email to view users"}
        </p>
        {normalizedSearchQuery && filteredUsers.length > 0 && (
          <UserList users={filteredUsers} searchQuery={normalizedSearchQuery} />
        )}
        {normalizedSearchQuery && filteredUsers.length === 0 && (
          <p className={styles.emptyState}>No users match your search.</p>
        )}
      </section>
    </>
  );
}
