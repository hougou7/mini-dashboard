"use client";

import { useEffect, useState } from "react";

import UserList from "@/components/UserList/UserList";
import UserManager from "@/components/UserManager/UserManager";
import { useUserServiceState } from "@/lib/use-user-service-state";
import {
  USER_PAGE_SIZE,
  type User,
  type UserListResponse,
} from "@/types/user";

import styles from "./UserSection.module.css";

type UserSectionProps = {
  initialPage: UserListResponse;
};

export default function UserSection({ initialPage }: UserSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const serviceState = useUserServiceState(initialPage, {
    search: debouncedSearchQuery,
    page: currentPage,
    pageSize: USER_PAGE_SIZE,
  });
  const {
    users,
    total,
    totalUsers,
    page,
    totalPages,
    isRefreshing,
    isPlaceholderData,
    isMutating,
    deleteUser,
  } = serviceState;

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [searchQuery]);

  const pageStart = (page - 1) * USER_PAGE_SIZE;
  const isSearchPending = searchQuery.trim() !== debouncedSearchQuery;
  const isListUpdating = isSearchPending || isRefreshing;

  async function handleDeleteUser(user: User) {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    const succeeded = await deleteUser(user.id);
    if (succeeded && editingUser?.id === user.id) {
      setEditingUser(null);
    }
    if (succeeded && users.length === 1 && page > 1) {
      setCurrentPage(page - 1);
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
          {total > 0 &&
            `Showing ${pageStart + 1}-${pageStart + users.length} of ${total}${debouncedSearchQuery ? ` matching users (${totalUsers} total)` : " users"}`}
          {isListUpdating && <span className={styles.fetching}>Updating...</span>}
        </p>
        <div className={styles.listContent} aria-busy={isListUpdating}>
        {total > 0 && (
          <>
            <UserList
              users={users}
              searchQuery={debouncedSearchQuery}
              onEdit={setEditingUser}
              onDelete={handleDeleteUser}
              isMutating={isMutating}
            />
            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="User list pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage(page - 1)}
                  disabled={page === 1 || isListUpdating || isPlaceholderData}
                >
                  Previous
                </button>
                <span aria-live="polite">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(page + 1)}
                  disabled={page === totalPages || isListUpdating || isPlaceholderData}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
        {total === 0 && !isListUpdating && (
          <p className={styles.emptyState}>
            {debouncedSearchQuery ? "No users match your search." : "No users yet."}
          </p>
        )}
        </div>
      </section>
    </>
  );
}
