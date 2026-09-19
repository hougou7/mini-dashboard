"use client";
import { useState } from "react";
import type { useUserServiceState } from "@/lib/use-user-service-state";
import type { User, UserInput } from "@/types/user";
import styles from "./UserManager.module.css";


type UserManagerProps = {
  editingUser?: User | null;
  onEditingChange?: (user: User | null) => void;
  serviceState: ReturnType<typeof useUserServiceState>;
};

const emptyUserForm: UserInput = {
  name: "",
  email: "",
};

export default function UserManager({
  editingUser = null,
  onEditingChange,
  serviceState,
}: UserManagerProps) {
    const {
      users,
      isRefreshing,
      isMutating,
      error,
      refreshUsers,
      createUser,
      updateUser,
    } = serviceState;

    const [userForm, setUserForm] = useState<UserInput>(() =>
      editingUser
        ? { name: editingUser.name, email: editingUser.email }
        : emptyUserForm,
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const input = {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
      };

      if (!input.name || !input.email) return;

      const succeeded = editingUser
        ? await updateUser(editingUser.id, input)
        : await createUser(input);

      if (succeeded) {
        setUserForm(emptyUserForm);
        onEditingChange?.(null);
      }
    }

    return (
        <div className={styles.manager}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formHeading}>
                  <h3>{editingUser ? "Edit user" : "Add user"}</h3>
                  {editingUser && (
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => onEditingChange?.(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <input
                type="text"
                aria-label="User name"
                placeholder="Name"
                value={userForm.name}
                onChange={(e) => setUserForm((form) => ({ ...form, name: e.target.value }))}
                required
                />
                <input
                type="email"
                aria-label="User email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm((form) => ({ ...form, email: e.target.value }))}
                required
                />
                <button type="submit" disabled={isMutating}>
                  {isMutating ? "Saving..." : editingUser ? "Save changes" : "Add user"}
                </button>
                <button
                    type="button"
                    onClick={refreshUsers}
                    disabled={isRefreshing || isMutating}
                >
                    {isRefreshing ? "Refreshing..." : "Refresh users"}
                </button>
            </form>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <p className={styles.total}>{users.length} total users</p>
        </div>
    );
}
