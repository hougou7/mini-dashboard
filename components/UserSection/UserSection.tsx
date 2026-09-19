"use client";

import { useMemo, useState } from "react";

import UserList from "@/components/UserList/UserList";
import UserManager from "@/components/UserManager/UserManager";
import { useUserServiceState } from "@/lib/use-user-service-state";
import type { User } from "@/types/user";

import styles from "./UserSection.module.css";

type UserSectionProps = {
  initialUsers: User[];
};

const PAGE_SIZE = 10;

export default function UserSection({ initialUsers }: UserSectionProps) {
  const serviceState = useUserServiceState(initialUsers);
  const { isMutating, deleteUser } = serviceState;
  const users: User[] = serviceState.users;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const normalizedSearchQuery = searchQuery.trim();

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalizedSearchQuery.toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedSearchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(pageStart, pageStart + PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  async function handleDeleteUser(user: User) {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    const succeeded = await deleteUser(user.id);
    if (succeeded && editingUser?.id === user.id) {
      setEditingUser(null);
    }
  }

  return (
    <>
      <section>
        <h2 className={styles.heading}>User Manager</h2>
        <UserManager
          key={editingUser?.id ?? "new-user"}
          editingUser={editingUser}
          onEditingChange={setEditingUser}
          serviceState={serviceState}
        />
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
                onChange={(event) => handleSearchChange(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearButton}
                  aria-label="Clear user search"
                  onClick={() => handleSearchChange("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filteredUsers.length > 0 &&
            `Showing ${pageStart + 1}-${pageStart + visibleUsers.length} of ${filteredUsers.length}${normalizedSearchQuery ? ` matching users (${users.length} total)` : " users"}`}
        </p>
        {filteredUsers.length > 0 && (
          <>
            <UserList
              users={visibleUsers}
              searchQuery={normalizedSearchQuery}
              onEdit={setEditingUser}
              onDelete={handleDeleteUser}
              isMutating={isMutating}
            />
            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="User list pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span aria-live="polite">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
        {filteredUsers.length === 0 && (
          <p className={styles.emptyState}>
            {normalizedSearchQuery ? "No users match your search." : "No users yet."}
          </p>
        )}
      </section>
    </>
  );
}
