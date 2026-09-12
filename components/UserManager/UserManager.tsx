"use client";
import { useState } from "react";
import { useUsers } from "@/components/UserContext/UserContext";
import type { User } from "@/components/UserList/UserList";
import styles from "./UserManager.module.css";


type UserManagerProps = {
  hideUserList?: boolean;
  editingUser?: User | null;
  onEditingChange?: (user: User | null) => void;
};

type UserForm = Pick<User, "name" | "email">;

const emptyUserForm: UserForm = {
  name: "",
  email: "",
};

export default function UserManager({
  hideUserList = false,
  editingUser = null,
  onEditingChange,
}: UserManagerProps) {
    const { state, refreshUsers, createUser, updateUser, deleteUser } = useUsers();
    const { users, isRefreshing, isMutating, error } = state;

    const [userForm, setUserForm] = useState<UserForm>(() =>
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

    async function handleDeleteUser(user: User) {
      if (!window.confirm(`Delete ${user.name}?`)) return;
      await deleteUser(user.id);
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
            {!hideUserList && (
                <div className={styles.list}>
                    {users.map((user) => (
                        <div className={styles.item} key={user.id}>
                            <div>
                                <strong>{user.name}</strong>
                                <p>{user.email}</p>
                            </div>
                            <div className={styles.itemActions}>
                              <button type="button" onClick={() => onEditingChange?.(user)}>
                                  Edit
                              </button>
                              <button type="button" onClick={() => handleDeleteUser(user)} disabled={isMutating}>
                                  Delete
                              </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
