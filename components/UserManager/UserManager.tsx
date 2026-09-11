"use client";
import { useState } from "react";
import { useUsers } from "@/components/UserContext/UserContext";
import type { User } from "@/components/UserList/UserList";
import styles from "./UserManager.module.css";


type UserManagerProps = {
  hideUserList?: boolean;
};

type UserForm = Pick<User, "name" | "email">;

const emptyUserForm: UserForm = {
  name: "",
  email: "",
};

export default function UserManager({
  hideUserList = false,
}: UserManagerProps) {
    const { state, dispatch, refreshUsers } = useUsers();
    const { users, isRefreshing } = state;

    const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);

    function handleAddUser() {
        if(!userForm.name.trim() || !userForm.email.trim()) return;
        const newUser: User = {
            id: Math.max(0, ...users.map((user) => user.id)) + 1,
            name: userForm.name.trim(),
            email: userForm.email.trim(),
        }
        dispatch({ type: "userAdded", user: newUser });
        setUserForm(emptyUserForm);
    }

    function handleDeleteUser(id: number) {
        dispatch({ type: "userDeleted", id });
    }
    return (
        <div className={styles.manager}>
            <div className={styles.form}>
                <input
                type="text"
                placeholder="Name"
                value={userForm.name}
                onChange={(e) => setUserForm((form) => ({ ...form, name: e.target.value }))}
                />
                <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm((form) => ({ ...form, email: e.target.value }))}
                />
                <button type="button" onClick={handleAddUser}>Add User</button>
                <button
                    type="button"
                    onClick={refreshUsers}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>
            <p className={styles.total}>Total users: {users.length}</p>
            {!hideUserList && (
                <div className={styles.list}>
                    {users.map((user) => (
                        <div className={styles.item} key={user.id}>
                            <div>
                                <strong>{user.name}</strong>
                                <p>{user.email}</p>
                            </div>
                            <button type="button" onClick={() => handleDeleteUser(user.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
